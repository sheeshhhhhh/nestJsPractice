import apiClient from "../util/apiClient" 
import { Restaurant } from '../types/restaurant.types'
import { useQuery } from "@tanstack/react-query"
import UpdateForm from "../components/PageComponents/UpdateRestaurant/UpdateForm"
import { useAuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import apiErrorHandler from "../util/apiErrorHandler"


const UpdateRestaurant = () => {
    const { user } = useAuthContext();
    
    // fetching the initial Data
    const { data, isLoading } = useQuery({
        queryKey: ['getRestaurant'],
        queryFn: async () => {
            const response = await apiClient.get(`/restaurant/${user?.restaurant?.id}`, { validateStatus: () => true })
            if(response.status > 400) {
                const message = response.data.message
                const error = response.data.error
                apiErrorHandler({ error, message, status: response.status })
            }
            return response.data as Restaurant
        },
        refetchOnWindowFocus: false
    })
    
    if(isLoading) return
    if(!data) {
        return <Navigate to={'/error'} />
    }

    return (
        <UpdateForm initialData={data} />
    )
}

export default UpdateRestaurant