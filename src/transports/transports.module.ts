import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs } from '../config';
import { TRANSPORTS_SERVICE } from '../config/services';

const commonModules = [
    ClientsModule.register([
        {
            name: TRANSPORTS_SERVICE,
            transport: Transport.NATS,
            options: {
                servers: envs.natsServers
            }
        }
    ],
    ),
]

@Module({
    imports: commonModules,
    exports: commonModules,
})
export class TransportsModule { }
