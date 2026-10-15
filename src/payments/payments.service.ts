import { Injectable } from '@nestjs/common';
import StripeConstructor from 'stripe';
import { envs } from '../config';
import { PaymentSessionDto } from './dto/payment-session.dto';

@Injectable()
export class PaymentsService {
    private readonly stripe = new StripeConstructor(
        envs.stripeSecret,
    );

    async createPaymentSession(paymentSessionDto: PaymentSessionDto): Promise<
        StripeConstructor.Response<StripeConstructor.Checkout.Session>
    > {

        const {currency, items} = paymentSessionDto

        const lineItems = items.map(item => {
            return {
                price_data: {
                    currency,
                    product_data: {
                        name: item.name,

                    },
                    unit_amount: Math.round(item.price) * 100
                },
                quantity: item.quantity,
            }
        })



        const session = await this.stripe.checkout.sessions.create({
          // TODO Colocar el id de la orden
          payment_intent_data: {
            metadata: {

            }
          },   

          line_items: lineItems,
          mode: 'payment',
          success_url: 'http://localhost:3000/payments/success',
          cancel_url: 'http://localhost:3000/payments/cancel',
        })

        return session
    }

}
