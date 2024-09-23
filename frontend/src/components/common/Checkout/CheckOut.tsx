import { PhilippinePeso, PhilippinePesoIcon, ReceiptTextIcon } from "lucide-react"
import PreviewMap from "../PreviewMap"
import { Card, CardContent, CardFooter } from "../../ui/card"
import { Textarea } from "../../ui/textarea"
import { memo, useState } from "react"
import { Button } from "../../ui/button"
import { useCartContext } from "../../../context/CartContext"
import { Separator } from "../../ui/separator"
import PaymentMethod, { PaymentMethodType } from "./PaymentMethod"
import { useAuthContext } from "../../../context/AuthContext"
import NoLocation from "./NoLocation"
import { useMutation } from "@tanstack/react-query"
import apiErrorHandler from "../../../util/apiErrorHandler"
import LoadingSpinner from "../LoadingSpinner"
import apiClient from "../../../util/apiClient"

type CheckOutProps = {
    price: number | undefined,
}

export type checkOutInfoType = {
    paymentMethod: PaymentMethodType,
    DeliveryInstructions?: string,
    deliveryFee: number,
}

const CheckOut = ({
    price,
}: CheckOutProps) => {
    const [checkOutInfo, setCheckOutInfo] = useState<checkOutInfoType>({
        paymentMethod: 'cash',
        DeliveryInstructions: '',
        deliveryFee: 44, // remove later and make dynamic
    }) 

    const { user } = useAuthContext()
    const { cart } = useCartContext()
    const deliveryFee = 44 // just this amount for now change later

    if(!user?.userInfo?.latitude && !user?.userInfo?.longitude || !user?.userInfo?.address) return <NoLocation /> // for handling error


    const { mutate, isPending } = useMutation({
        mutationKey: ['checkout'],
        mutationFn: async () => {
            const response = await apiClient.post('/order', checkOutInfo, {
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            
            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status:response.status })
            }
            //redirect to payment
            const redirectUrl = response.data.redirectPayment
            if(response.data.paymentMethod === 'cash') {
                return window.location.assign(`/order/${response.data.data.id}`)
            } else { 
                return window.location.assign(redirectUrl)
            }
        }
    })

    return (
        <div>
            <div className="space-y-2">
                <Card className="shadow-lg">
                    <CardContent className="pt-6 space-y-3">
                        <PreviewMap 
                        positionMarker={{
                            lat: user.userInfo.latitude,
                            lng: user.userInfo.longitude
                        }}
                        MarkerName={user.name}
                        maxZoom={18}
                        minZoom={15}
                        dragging={false}
                        className="w-[420px] h-[180px] rounded-lg"
                        zoomControl={false}
                        />
                        
                        <h2>
                            {user.userInfo.address}
                        </h2>
                        <Textarea 
                        value={checkOutInfo.DeliveryInstructions}
                        onChange={(e) => setCheckOutInfo(prev => ({
                            ...prev, DeliveryInstructions: e.target.value
                        }))}
                        className="resize-none"
                        placeholder="Delivery instructions"
                        />
                    </CardContent>
                </Card>

                <PaymentMethod 
                setSelectedPaymentMethod={setCheckOutInfo}
                selectedPaymentMethod={checkOutInfo.paymentMethod}
                />

                <Card className="shadow-lg">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 pb-2">
                            <ReceiptTextIcon />
                            <h2 className="font-bold text-lg">
                                Order Summary
                            </h2>
                        </div>
                        {cart?.cartItems.map((cartItem) => {
                            // if options are added then make sure that it can be seen here
                            return (
                                <div className="flex gap-3">
                                    <p>
                                        {cartItem.quantity}x
                                    </p>
                                    <p className="w-full max-w-[340px]">
                                        {cartItem.menu.name}
                                    </p>
                                    <div className="flex items-center">
                                        <PhilippinePeso size={14} />
                                        {cartItem.price}
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                    <Separator />
                    <CardFooter className="pt-6 flex-col">
                        <div className="w-full flex justify-between items-center text-muted-foreground">
                            <h2>
                                Subtotal
                            </h2>
                            <div className="flex items-center">
                                <PhilippinePeso size={14} />
                                {price}
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-center text-muted-foreground">
                            <h2>
                                Standard delivery
                            </h2>
                            <div className="flex items-center">
                                {/* should put the price of delivery here */}
                                <PhilippinePeso size={14} />
                                {deliveryFee}
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div className="relative w-full h-[20px]">
            </div>
            <div className="sticky z-20 bg-white py-2 px-4 w-full h-[80px] bottom-0">
                <div className="flex justify-between">
                    <h2 className="font-bold text-lg">
                        Total {" "}
                        <span className="font-medium text-sm text-muted-foreground">
                            (incl. fees and tax)
                        </span>
                    </h2>
                    <div className="font-bold text-lg flex items-center">
                        <PhilippinePesoIcon size={18} />
                        <h2>
                            {price! + deliveryFee}
                        </h2>
                    </div>
                </div>
                <Button
                disabled={isPending}
                onClick={() => mutate()}
                className="w-full"
                >
                    {isPending ? <LoadingSpinner /> : "Place order"}
                </Button>
            </div>
        </div>
    )
}

export default memo(CheckOut)