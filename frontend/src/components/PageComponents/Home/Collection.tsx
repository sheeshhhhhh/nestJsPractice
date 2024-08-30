import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../util/apiClient'
import { useSearchParams } from 'react-router-dom'
import { Restaurant as RestaurantType } from '../../../types/restaurant.types'
import Restaurant from './Restaurant'
import CannotFind from './CannotFind'

const Collection = () => {
    const [searchParams] = useSearchParams()
    const search = searchParams.get('s')

    const { data, isLoading } = useQuery<RestaurantType[] | []>({
        queryKey: ['restaurants'],
        queryFn: async () => {
            const response = await apiClient.get(`/restaurant/GetManyRestaurants?search=${search}`)
            if(response.data.error) throw new Error(response.data.error)
            return response.data || [] as RestaurantType[] | []
        },
        refetchOnWindowFocus: false
    })
    
    if(isLoading) return null
    if(data?.length === 0) return <CannotFind />

    return (
        <div className='flex'>
            {data?.map((restaurant) => {
                return <Restaurant restaurant={restaurant} />
            })}      
        </div>
    )
}

export default Collection