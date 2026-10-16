import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TransportsModule } from '../transports/transports.module';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService],
  imports: [
    TransportsModule,
  ]
})
export class PaymentsModule {}
