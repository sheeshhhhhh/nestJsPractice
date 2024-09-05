import { useAuthContext } from '../../../../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../../util/apiClient'
import apiErrorHandler from '../../../../../util/apiErrorHandler'
import { category } from '../../../../../types/restaurant.types'

const getCategories = async () => {
  
    const { user } = useAuthContext()
    const { data: Category, isLoading } = useQuery({
        queryKey: ['category'],
        queryFn: async () => {
            const response = await apiClient.get(`/category/${user?.restaurant?.id}`, {
                validateStatus: () => true
            })

            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status: response.status })
            }
            return response.data as category[]
        }
    })


    if(Category)
}

export default getCategories