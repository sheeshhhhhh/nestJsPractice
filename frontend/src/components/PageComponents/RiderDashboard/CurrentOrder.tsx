import LoadingSpinner from "@/components/common/LoadingSpinner"
import OrderMapRider from "@/components/common/OrderMapRider"
import apiClient from "@/util/apiClient"
import { useQuery } from "@tanstack/react-query"
import { LatLngExpression } from "leaflet"
import toast from "react-hot-toast"

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
            <div>
                <OrderMapRider 
                zoom={15}
                center={[currentOrder?.latitude, currentOrder?.longitude] as LatLngExpression}
                className="w-[300px] h-[300px]"
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
            <div className="w-full h-full p-4">
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
        </div>
    )
}

export default CurrentOrder