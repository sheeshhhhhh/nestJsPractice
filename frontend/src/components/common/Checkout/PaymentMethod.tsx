import { CreditCardIcon } from "lucide-react"
import { Card, CardContent } from "../../ui/card"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"
import { Dispatch, SetStateAction } from "react"
import { checkOutInfoType } from "./CheckOut"

export type PaymentMethodType = 'cash' | 'gcash' | 'paymaya'
const paymentMethods = ['cash', 'gcash', 'paymaya']

type PaymentMethodProps = {
    selectedPaymentMethod: PaymentMethodType,
    setSelectedPaymentMethod: Dispatch<SetStateAction<checkOutInfoType>>
}

const PaymentMethod = ({
    selectedPaymentMethod,
    setSelectedPaymentMethod
}: PaymentMethodProps) => {

    const changePaymentMethod = (value: PaymentMethodType) => {
        setSelectedPaymentMethod(prev => ({
            ...prev, 
            paymentMethod: value
        }))
    }

    return (
        <Card className="shadow-lg">
            <CardContent className="pt-6">
                {/* by default should be cash */}
                <div className="flex items-center gap-2 pb-2">
                    <CreditCardIcon />
                    <h2 className="font-bold text-lg">
                        Payment Method
                    </h2>
                </div>
                {/* make a radio here to sort of select */}
                <RadioGroup 
                className="gap-0"
                value={selectedPaymentMethod}
                onValueChange={(value: PaymentMethodType) => changePaymentMethod(value)}>
                    {paymentMethods.map((paymentmethod: any, idx: number) => {
                        return (
                            <div 
                            onClick={() => changePaymentMethod(paymentmethod)}
                            className={`flex justify-between items-center space-x-2 cursor-pointer
                            hover:bg-muted p-2 rounded-lg px-4 
                            ${paymentmethod === selectedPaymentMethod && 'bg-muted'}`}>
                                <h2 className="font-bold text-lg first-letter:uppercase">
                                    {paymentmethod}
                                </h2>
                                <RadioGroupItem value={paymentmethod} id={idx.toString()} />
                            </div>
                        )
                    })}
                </RadioGroup>
            </CardContent>
        </Card>
    )
}

export default PaymentMethod