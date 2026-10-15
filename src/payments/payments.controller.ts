import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import StripeConstructor from 'stripe';
import { envs } from '../config';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Controller('payments')
export class PaymentsController {
  private readonly stripe = new StripeConstructor(envs.stripeSecret);

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
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const sig = req.headers['stripe-signature'] ?? '';
    const endpointSecret = 'whsec_nGSV01nyL3yi6CYEG9ox3G9AlRLtTFyw';

    console.log('=== Webhook de Stripe llamado ===');
    console.log('Llega -> method:', req.method, '| url:', req.url);
    console.log('Llega -> stripe-signature:', sig);
    console.log(
      'Llega -> rawBody:',
      req.rawBody ? `${req.rawBody.length} bytes` : 'undefined',
    );

    let event: StripeConstructor.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        endpointSecret,
      );
    } catch (error) {
      console.error(
        'Error en PaymentsController.stripeWebhook al construir el evento:',
      );
      console.error(error);

      res.status(400).json({
        ok: false,
        where: 'PaymentsController.stripeWebhook',
        error: (error as Error).message,
      });
      return;
    }

    console.log('Evento de Stripe recibido:', event.type);
    console.log(JSON.stringify(event, null, 2));

    const response = { received: true, type: event.type };
    console.log('Retorna el controller ->', response);

    res.status(200).json(response);
  }

}
