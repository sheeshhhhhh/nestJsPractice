import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosError } from 'axios'

@Injectable()
export class PaymongoService {
    //it's not yet tested

    // php currency by default
    async createPaymentIntent(amount: number)  {
        try {
            const PaymentIntent = await axios.post(`${process.env.PAYMONGO_API_BASEURL}/payment_intents`, 
                JSON.stringify(
                    {
                        data: {
                            attributes: {
                                amount : amount,
                                payment_method_allowed: [
                                    "paymaya",
                                    "gcash"
                                ],
                                payment_method_options: { 
                                    card : { 
                                        request_three_d_secure : "any" 
                                    } 
                                },
                                currency: "PHP",
                                capture_type : "automatic"
                            }
                        }
                    }
                ),
                {
                    headers: {
                        "Authorization": `Basic ${Buffer.from(process.env.PAYMONGO_TEST_SECRET).toString('base64')}`,
                        "Content-Type": "application/json",
                        "Accept" : "application/json"
                    }
                }
            ) 
            // should send the client key to the frontend
            return PaymentIntent
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException("an error has occured")
        }
    }

    async retrievePaymentIntent(paymentIntentId: string) {
        const privateApiKey = process.env.PAYMONGO_TEST_SECRET // this is the private key for paymongotest

        if(!paymentIntentId) {
            throw new GoneException("missing payment intent id")
        }
        
        const getPaymentIntent = await axios.get(`${process.env.PAYMONGO_API_BASEURL}/payment_intents/${paymentIntentId}`,
            {
                headers: {
                    "Accept": "application/json",
                    "Authorization" : `Basic ${Buffer.from(privateApiKey).toString('base64')}`
                }
            }
        )

        return getPaymentIntent
    }

    async attachPaymentIntent(paymentIntentId: string, paymentMethodId: string, clientKey: string) {
        const returnUrl = process.env.BASE_URL + '/paymentSuccessful'

        const attachingPaymentIntent_To_PaymentMethod = await axios.post(
            `https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`,
            JSON.stringify(
                {
                    data: {
                        attributes: {
                            payment_method: paymentMethodId,
                            clientKey: clientKey,
                            returnUrl: returnUrl
                        }
                    }
                }
            ),
            {
                headers: {
                    "Accept" : "application/json",
                    "Content-Type" : "application/json",
                    "Authorization" : `Basic ${Buffer.from(process.env.PAYMONGO_TEST_PUBLIC)}` 
                }
            }
        )

        return attachingPaymentIntent_To_PaymentMethod
        // better to just redirect
    }


    //create payment method later
}
