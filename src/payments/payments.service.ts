import { Injectable } from '@nestjs/common';
import StripeConstructor from 'stripe';
import { envs } from '../config';

@Injectable()
export class PaymentsService {
    private readonly stripe = new StripeConstructor(
        envs.stripeSecret,
    );

    
}
