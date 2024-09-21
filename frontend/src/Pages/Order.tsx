import { MapPinIcon, MessageSquareMoreIcon, MessageSquareTextIcon, PhilippinePesoIcon, ReceiptTextIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Separator } from "../components/ui/separator"
import AvatarProfile from "../components/common/AvatarProfile"
import OrderMapRider, { markerPosition } from "../components/common/OrderMapRider"
import { LatLngExpression } from "leaflet"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import apiClient from "../util/apiClient"
import type { Order } from "../types/order.types"

const exampleData: markerPosition[] = [
    {
        id: 'thisisrandomId',
        name: 'customer',
        role: 'Customer',
        lat: 14.823515,
        lng: 120.947077
    },
    {
        id: 'riderId',
        name: 'McdoRider',
        role: 'Rider',
        lat: 14.822146,
        lng: 120.952174
    }
]

const Order = () => {
    const { orderId } = useParams()
    const { data:OrderInfo, isLoading } = useQuery({
        queryKey: ['currOrder', orderId],
        queryFn: async () => {
            const response = await apiClient.get(`/order/currOrder/${orderId}`)
            return response.data as Order
        }, 
        retry: false
    })

    if(isLoading) return
    if(!OrderInfo) return window.location.assign('/error')

    return (
        <div className="max-w-[748px] mx-auto space-y-4 p-6">
            <div className="flex w-full items-center justify-between">
                <div>
                    {/* make this a link to go back to browsing but also display the current order */}
                </div>
                <CardTitle>
                    Your Order
                </CardTitle>
                <h2 className="text-blue-600 text-xl font-bold">
                    Help
                </h2>
            </div>
            <div >
                <div className="w-[700px] h-[400px] mb-5">
                    <OrderMapRider 
                    zoom={15}
                    center={[exampleData[0].lat, exampleData[0].lng] as LatLngExpression}
                    className="w-[700px] h-[400px] rounded-lg"
                    positionMarker={exampleData} />
                </div>
                <div className="flex flex-col items-center">
                    {/* <h2 className="font-medium text-muted-foreground">
                        Estimated delivery time
                    </h2>
                    <div>
                        <h2 className="text-2xl font-bold">
                            30 - 35 mins
                        </h2>
                    </div> */}
                    {/* put loading bar here later */}
                    <h2 className="text-xl font-semibold text-muted-foreground">
                        {OrderInfo?.status}
                    </h2>
                </div>
            </div>
            <Card className="shadow-md max-w-[600px] mx-auto p-3 flex justify-between px-6 cursor-pointer">
                <div className="flex gap-6">
                    <AvatarProfile 
                    className="size-[56px]"
                    // change later to riders profile
                    src="https://lh3.googleusercontent.com/a/ACg8ocILSyRnrrWoY3MgN6TsdeI6SfLn1NvnknRuttegNo9rU3624I8=s96-c"
                    />
                    <div className="flex flex-col justify-center items-start ">
                        <h2 className="font-bold text-lg">
                            Contact your rider
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Add delivery instructions
                        </p>
                    </div>
                </div>
                <div className="p-[4px] h-[58px] w-[100px] relative">
                    <MessageSquareTextIcon 
                    className="absolute right-2 top-0"
                    style={{
                        transform: 'scaleX(-1)' // to flip the svg
                    }}
                    size={45} />
                    <MessageSquareMoreIcon 
                    fill="white"
                    size={45}
                    className="absolute bottom-1 left-7 z-20"
                    />
                </div>        
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex gap-2 items-center" >
                        <MapPinIcon />
                        <h2 className="text-lg font-semibold">
                            Delivery details
                        </h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <h2 className="font-medium text-lg">
                       {OrderInfo?.deliveryAddress}
                    </h2>
                    {OrderInfo?.deliveryInstructions && 
                        <div className="flex max-w-[550px]">
                            <div className="font-bold text-lg">
                                "
                            </div>
                            <p className="text-muted-foreground">
                                {OrderInfo.deliveryInstructions}
                            </p>
                            <div className="font-bold text-lg">
                                "
                            </div>
                        </div>
                    }
                </CardContent>
            </Card>
            <Card className="shadow-lg">
                <CardHeader>
                    <div className="flex gap-2 items-center">
                        <ReceiptTextIcon />
                        <h2 className="text-lg font-semibold">
                            Order details
                        </h2>
                    </div>
                </CardHeader>
                <CardContent>
                    <div>
                        <h2 className="font-medium text-xl">
                            {OrderInfo.restaurant?.name}
                        </h2>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="font-medium text-xl text-muted-foreground">
                                Order Id
                            </h2>
                            <h2 className="font-medium text-xl">
                                {OrderInfo.id}
                            </h2>
                        </div>
                    </div>
                    <div className="px-7">
                        <Separator className="h-[2px] my-3" />
                    </div>
                    <div>
                        {OrderInfo.orderItems?.map((cartItem) => {
                            return (
                                <div className="flex items-center justify-between">
                                    <div className="flex">
                                        <h2 className="font-medium mr-2">
                                            {cartItem.quantity}
                                        </h2>
                                        <h2 className="text-muted-foreground">
                                            {cartItem.menu.name}
                                        </h2>
                                    </div>
                                    <div className="font-bold flex items-center">
                                        <PhilippinePesoIcon size={14} />
                                        <h2>
                                            {cartItem.price}
                                        </h2>
                                    </div>
                                </div>     
                            )
                        })}
                    </div>
                </CardContent>
                <CardFooter className="justify-between">
                    <div className="w-full">
                        <div className="flex items-center justify-between font-semibold text-muted-foreground">
                            <h2>
                                Delivery Fee
                            </h2>
                            <h2>
                                {OrderInfo.deliveryFee}
                            </h2>
                        </div>
                        <div className="flex items-center justify-between font-semibold text-muted-foreground">
                            <h2>
                                Sub total
                            </h2>
                            <h2>
                                {OrderInfo.subTotal}
                            </h2>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <h2 className="font-bold text-xl">
                            Total
                            </h2>
                            <div className="font-bold flex items-center text-xl">
                                <PhilippinePesoIcon size={20} />
                                <h2>
                                    {OrderInfo.totalAmount}
                                </h2>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Order