import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import StripeConstructor from 'stripe';
import { envs } from '../config';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { PaymentSessionResponseDto } from './dto/payment-session-response.dto';
import {MessagePattern} from '@nestjs/microservices'

@Controller('payments')
export class PaymentsController {
  private readonly stripe = new StripeConstructor(envs.stripeSecret);

  constructor(private readonly paymentsService: PaymentsService) { }

  @Post('create-payment-session')
  @MessagePattern({cmd: 'create.payment.session'})
  createPaymentSession(
    @Body() paymentSessionDto: PaymentSessionDto,
  ){
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
    const endpointSecret = envs.stripeEndpointSecret

    let event: StripeConstructor.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody!,
        sig,
        endpointSecret,
      );
    } catch (error) {
     

      res.status(400).json({
        ok: false,
        where: 'PaymentsController.stripeWebhook',
        error: (error as Error).message,
      });
      return;
    }


    const response = { received: true, type: event.type };

    res.status(200).json(response);
    this.paymentsService.handleWebhook(event)
  }

}
