import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import apiClient from "../util/apiClient"
import apiErrorHandler from "../util/apiErrorHandler"
import RestaurantHeader from "../components/PageComponents/Restaurant/RestaurantHeader"
import { RestaurantWithCategories } from "../types/restaurant.types"
import RestaurantItems from "../components/PageComponents/Restaurant/RestaurantItems"
import RestaurantReviews from "@/components/PageComponents/Restaurant/RestaurantReviews"

const Restaurant = () => {
    const { id } = useParams()
    
    const { data: restaurantInfo, isLoading } = useQuery({
        queryKey: ['restaurant'],
        queryFn: async () => {
            const response = await apiClient.get(`/restaurant/${id}`, {
                validateStatus: () => true,
            })
            
            if(response.status >= 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, status: response.status, message })
            }
            return response.data as RestaurantWithCategories
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) return null
    if(!restaurantInfo) return // navigate later

    return (
        <div className="max-w-[1050px] w-full mx-auto p-6">
            <RestaurantHeader restaurant={restaurantInfo} />
            {/* <PastOrders /> */}
            <RestaurantReviews reviews={restaurantInfo.reviews} />
            <RestaurantItems restaurant={restaurantInfo} />
        </div>
    )
}

export default Restaurant