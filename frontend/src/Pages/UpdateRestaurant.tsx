import apiClient from "../util/apiClient" 
import { Restaurant } from '../types/restaurant.types'
import { useQuery } from "@tanstack/react-query"
import { AxiosResponse } from "axios"
import UpdateForm from "../components/PageComponents/UpdateRestaurant/UpdateForm"
import { useAuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"


const UpdateRestaurant = () => {
    const { user } = useAuthContext();
    
    // fetching the initial Data
    const { data, isLoading } = useQuery({
        queryKey: ['getRestaurant'],
        queryFn: async () => {
            const response: AxiosResponse<Restaurant> = await apiClient.get(`/restaurant/${user?.restaurant?.id}`)
            if(response.data) {
                const data = response.data
            }
            return response.data
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