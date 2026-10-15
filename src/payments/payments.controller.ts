import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-payment-session')
  createPaymentSession() {
    return 'POST createPaymentSession'
  }

  @Get('success')
  success() {
    return {
      ok: true,
      message: 'payment successfull',
    }
  }


  @Get('cancel')
  cancel() {
    return {
      ok: false,
      message: 'payment cancel'
    }
  }

  @Post('webhook')
  async stripeWebhook() {
    return 'stripeWebhook'
  }

}
