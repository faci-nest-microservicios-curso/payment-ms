import { Injectable } from '@nestjs/common';
import StripeConstructor from 'stripe';
import { envs } from '../config';

@Injectable()
export class PaymentsService {
    private readonly stripe = new StripeConstructor(
        envs.stripeSecret,
    );

    async createPaymentSession(): Promise<
        StripeConstructor.Response<StripeConstructor.Checkout.Session>
    > {
        const session = await this.stripe.checkout.sessions.create({
          // TODO Colocar el id de la orden
          payment_intent_data: {
            metadata: {

            }
          },   

          line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',

                    },
                    unit_amount: 2000, //Centavos,
                },
                quantity: 2,
            },
          ],
          mode: 'payment',
          success_url: 'http://localhost:3000/payments/success',
          cancel_url: 'http://localhost:3000/payments/cancel',
        })

        return session
    }

}
