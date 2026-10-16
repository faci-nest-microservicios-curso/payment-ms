import { Inject, Injectable } from '@nestjs/common';
import StripeConstructor from 'stripe';
import { envs } from '../config';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { TRANSPORTS_SERVICE } from '../config/services';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {

    constructor(
        @Inject(TRANSPORTS_SERVICE) private readonly client: ClientProxy,  
    ){}

    private readonly stripe = new StripeConstructor(
        envs.stripeSecret,
    );

    async createPaymentSession(
        paymentSessionDto: PaymentSessionDto,
    ){

        const {currency, items, orderId} = paymentSessionDto

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
          payment_intent_data: {
            metadata: {
                orderId
            }
          },   

          line_items: lineItems,
          mode: 'payment',
          success_url: envs.stripeSuccessUrl,
          cancel_url: envs.stripeCancelUrl,
        })

        return {
            cancelUrl: session.cancel_url,
            successUrl: session.success_url,
            url: session.url,
        }
    }


    async handleWebhook(event:StripeConstructor.Event) {

        switch(event.type) {
            case 'charge.succeeded':
                const chargeSucceded = event.data.object
                const metadata = chargeSucceded.metadata
                const {orderId} = metadata 
                const payload = {
                    stripePaymentId : chargeSucceded.id,
                    orderId,
                    reciptUrl: chargeSucceded.receipt_url
                }


                console.log({payload})
                this.client.emit({cmd: 'payment.succedded'}, payload)
                break;
        }
    }

}
