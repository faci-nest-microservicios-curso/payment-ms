import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TransportsModule } from '../transports/transports.module';
import { AuthGuard } from '../auth/guards/auth.guard';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, AuthGuard],
  imports: [
    TransportsModule,
  ]
})
export class PaymentsModule {}
