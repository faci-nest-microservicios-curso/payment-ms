import { Body, Controller, Get, Post } from '@nestjs/common';
import StripeConstructor from 'stripe';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto : PaymentSessionDto): Promise<
    StripeConstructor.Response<StripeConstructor.Checkout.Session>
  > {
    return this.paymentsService.createPaymentSession(paymentSessionDto);
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
