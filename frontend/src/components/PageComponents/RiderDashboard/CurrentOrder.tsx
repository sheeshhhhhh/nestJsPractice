import AvatarProfile from "@/components/common/AvatarProfile"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import OrderMapRider from "@/components/common/OrderMapRider"
import { Card } from "@/components/ui/card"
import apiClient from "@/util/apiClient"
import { useQuery } from "@tanstack/react-query"
import { LatLngExpression } from "leaflet"
import { MessageSquareMoreIcon, MessageSquareTextIcon } from "lucide-react"
import toast from "react-hot-toast"
import OrderDelivered from "./OrderDelivered"
import { Link } from "react-router-dom"

const CurrentOrder = () => {

    const { data: currentOrder, isLoading, error } = useQuery({
        queryKey: ['riderCurrentOrder'],
        queryFn: async () => {
            const response = await apiClient.get('/rider/CurrentOrder')
            if(response.status >= 400) {
                toast.error(response.data.message)
                if(response.status === 410) {
                    return undefined
                }
            }
            return response.data
        }
    })

    if(isLoading) {
        return (
            <div>
                <LoadingSpinner />
            </div>
        )
    }
    
    if(error) {
        // just displaying the error
        return (
            <div>
                <h2 className="text-3xl font-bold">
                    Error
                </h2>
                <p className="text-lg">
                    {error.message}
                </p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-center items-center">
                <OrderMapRider 
                zoom={15}
                center={[currentOrder?.latitude, currentOrder?.longitude] as LatLngExpression}
                className="w-full max-w-[800px] h-[400px] z-0"
                positionMarker={[
                    {
                        id: 'rider',
                        role: 'Rider',
                        lat: 14.5234589327743,
                        lng: 120.9486043453217,
                    },
                    {
                        id: currentOrder?.user?.id,
                        role: 'Customer',
                        lat: currentOrder?.latitude,
                        lng: currentOrder?.longitude,
                        name: currentOrder?.user?.name
                    }
                ]}
                />
            </div>
            <Link to={`/orderMessage/${currentOrder.id}`}>
                <Card className="shadow-md max-w-[600px] mx-auto p-3 flex justify-between px-6 cursor-pointer my-4">
                    <div className="flex gap-6">
                        <AvatarProfile 
                        className="size-[56px]"
                        // change later to riders profile
                        src="https://lh3.googleusercontent.com/a/ACg8ocILSyRnrrWoY3MgN6TsdeI6SfLn1NvnknRuttegNo9rU3624I8=s96-c"
                        />
                        <div className="flex flex-col justify-center items-start ">
                            <h2 className="font-bold text-lg">
                                Contact your Customer
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                You can message your customer here
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
            </Link>
            <div className="w-full max-w-[800px] mx-auto h-full p-4 my-2">
                <h2 className="text-3xl font-bold mb-3">
                    Current Order
                </h2>
                <div className="p-3">
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">
                            orderId: 
                        </h2>
                        <h2 className="text-lg">
                            {currentOrder?.id}
                        </h2>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">
                            Address: 
                        </h2>
                        <h2 className="text-lg">
                            {currentOrder?.deliveryAddress}
                        </h2>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">
                            Order Status: 
                        </h2>
                        <h2 className="text-lg">
                            {currentOrder?.status}
                        </h2>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">
                            paymentMethod
                        </h2>
                        <h2 className="text-lg">
                            {currentOrder?.paymentMethod}
                        </h2>
                    </div>
                    <div className="flex justify-between items-center">
                        <h2 className="font-medium text-lg">
                            totalAmount
                        </h2>
                        <h2 className="text-lg">
                            {currentOrder?.totalAmount}
                        </h2>
                    </div>
                </div>
            </div>
            <OrderDelivered orderId={currentOrder.id} />
        </div>
    )
}

export default CurrentOrder