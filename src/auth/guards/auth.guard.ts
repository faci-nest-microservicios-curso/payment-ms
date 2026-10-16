import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { Request } from 'express';
import { firstValueFrom } from 'rxjs';

import { TRANSPORTS_SERVICE } from '../../config/services';

/**
 * Valida el JWT delegando en auth-ms (`auth.verify.user`) a través de NATS,
 * igual que hace el AuthGuard del gateway. Solo aplica a peticiones HTTP:
 * los mensajes internos (NATS) no llevan el token del usuario.
 */
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(TRANSPORTS_SERVICE) private readonly client: ClientProxy,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() !== 'http') {
            return true;
        }

        const request = context.switchToHttp().getRequest<Request>();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token no encontrado');
        }

        try {
            await firstValueFrom(
                this.client.send({ cmd: 'auth.verify.user' }, { token }),
            );
        } catch {
            throw new UnauthorizedException('Token inválido');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
