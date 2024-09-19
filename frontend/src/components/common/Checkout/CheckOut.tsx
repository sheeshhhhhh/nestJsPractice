import { CreditCardIcon, PhilippinePeso, PhilippinePesoIcon, ReceiptTextIcon, ShieldAlert } from "lucide-react"
import GoogleMaps from "../../PageComponents/CreateRestaurant/GoogleMaps"
import { useAuthContext } from "../../../context/AuthContext"
import PreviewMap from "../PreviewMap"
import { Card, CardContent, CardFooter } from "../../ui/card"
import { Textarea } from "../../ui/textarea"
import { Navigate } from "react-router-dom"
import { Dispatch, memo, SetStateAction, useState } from "react"
import { StageStatus } from "../NavBar/NavCart"
import toast from "react-hot-toast"
import { Button } from "../../ui/button"
import { useCartContext } from "../../../context/CartContext"
import { Separator } from "../../ui/separator"
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group"

type CheckOutProps = {
    price: number | undefined,
    setStage: Dispatch<SetStateAction<StageStatus>>
}

type PaymentMethod = 'cash' | 'gcash' | 'paymaya'
const paymentMethods = ['cash', 'gcash', 'paymaya']

const CheckOut = ({
    price,
    setStage
}: CheckOutProps) => {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
    const { user } = useAuthContext()
    const { cart } = useCartContext()
    const deliveryFee = 44 // just this amount for now change later

    console.log(paymentMethod)

    if(!user?.userInfo.latitude && !user?.userInfo.longitude || !user.userInfo.address) 
        return (
            <div className="w-full h-[200px] p-4 flex flex-col items-center">
                <h2 className="text-red-600 font-medium">
                    Error please make sure you have configure you location
                </h2>
                {/* provide a link for settings location or address */}
                <div className="p-6">
                    <ShieldAlert 
                    size={80}
                    />
                </div>
                <Button
                onClick={() => setStage('Cart')}
                >
                    Go Back to Cart
                </Button>
            </div>
        )

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
                        className="resize-none"
                        placeholder="Delivery instructions"
                        />
                    </CardContent>
                </Card>
                
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
                        value={paymentMethod} 
                        onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                            {paymentMethods.map((paymentmethod: any, idx: number) => {
                                return (
                                    <div 
                                    onClick={() => setPaymentMethod(paymentmethod)}
                                    className={`flex justify-between items-center space-x-2 cursor-pointer
                                    hover:bg-muted p-2 rounded-lg px-4 
                                    ${paymentmethod === paymentMethod && 'bg-muted'}`}>
                                        <h2 className="font-bold text-lg">
                                            {paymentmethod}
                                        </h2>
                                        <RadioGroupItem value={paymentmethod} id={idx.toString()} />
                                    </div>
                                )
                            })}
                        </RadioGroup>
                    </CardContent>
                </Card>

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
            <div className="sticky z-20 bg-white py-2 px-4 w-full max-w-[502px] h-[80px] bottom-0">
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
                className="w-full"
                >
                    Place order
                </Button>
            </div>
        </div>
    )
}

export default memo(CheckOut)