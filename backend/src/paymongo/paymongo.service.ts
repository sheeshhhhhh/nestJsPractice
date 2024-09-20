import { BadRequestException, GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios'
import { paymentMethod } from 'src/order/entities/paymentMethods.entities';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PaymongoService {

    getHeaders(keyType: "public" | "secret") {
        const paymongoKey = keyType === "public" ? 
            process.env.PAYMONGO_TEST_PUBLIC 
            : process.env.PAYMONGO_TEST_SECRET  

        return{ 
            headers: {
                "Authorization": `Basic ${Buffer.from(paymongoKey).toString('base64')}`,
                "Content-Type": "application/json",
                "Accept" : "application/json"
            },
            
        }
    }

    // php currency by default
    async createPaymentIntent(amount: number)  {
        try {
            if(amount < 100) {
                throw new BadRequestException('100 minimum of payment required')
            }

            const PaymentIntent = await axios.post(`${process.env.PAYMONGO_API_BASEURL}/payment_intents`, 
                JSON.stringify(
                    {
                        data: {
                            attributes: {
                                amount : parseInt(amount.toString() + '00'), // jsut adding 00 becasue it is needed
                                payment_method_allowed:[
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
                {...this.getHeaders("secret"), validateStatus: () => true}
            ) 
            // should send the client key to the frontend
            return PaymentIntent.data.data
        } catch (error) {
            throw new InternalServerErrorException("an error has occured")
        }
    }

    async retrievePaymentIntent(paymentIntentId: string) {

        if(!paymentIntentId) {
            throw new GoneException("missing payment intent id")
        }
        
        const getPaymentIntent = await axios.get(`${process.env.PAYMONGO_API_BASEURL}/payment_intents/${paymentIntentId}`,
            this.getHeaders("secret")
        )

        return getPaymentIntent.data.data
    }

    async attachPaymentIntent(paymentIntentId: string, paymentMethodId: string, clientKey: string) {
        const returnUrl = process.env.CLIENT_BASE_URL + '/paymentSuccessful'

        const attachingPaymentIntent_To_PaymentMethod = await axios.post(
            `${process.env.PAYMONGO_API_BASEURL}/payment_intents/${paymentIntentId}/attach`,
            JSON.stringify(
                {
                    data: {
                        attributes: {
                            payment_method: paymentMethodId,
                            client_key: clientKey,
                            return_url: returnUrl
                        }
                    }
                }
            ),
            {
                ...this.getHeaders("public"),
                validateStatus: () => true
            }
        )
        return attachingPaymentIntent_To_PaymentMethod.data.data
        // better to just redirect
    }

    async createPaymentMethod(userpaymentMethod: paymentMethod, userId?: string) {
        // if user has biling info then automate it for him
        // let billingInformation;
        // if(userId) {
        //     const billingInformation = await this.prisma.billingInfo.findFirst()
        //     // do later
        // }

        const newPaymentMethod = await axios.post(`${process.env.PAYMONGO_API_BASEURL}/payment_methods`, JSON.stringify({
            data: {
                attributes: {
                    type: userpaymentMethod,
                    // billing: {
                    //     name: undefined,
                    //     email: undefined,
                    //     phone: undefined
                    // }
                }
            }
        }), this.getHeaders('public'))


        return newPaymentMethod.data.data
    }
    //create payment method later
}
