import { Link } from 'react-router-dom'
import { businessStatus, Restaurant as RestaurantType } from '../../../types/restaurant.types'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../ui/card'
import { PhilippinePesoIcon } from 'lucide-react'

type RestaurantProps = {
    restaurant: RestaurantType
}

const Restaurant = ({
    restaurant
} : RestaurantProps) => {

    const isOpen = restaurant.status === businessStatus.Open
    return (
        <Link 
        className='max-w-[300px] h-[220px]'
        to={`/restaurant/${restaurant.id}`} >
            <Card
            className='max-w-[300px] h-[220px] '
            >
                <CardHeader>
                    {/* attach a photo here later */}
                </CardHeader>
                <CardContent>
                    <div className='flex justify-between mb-1'>
                        <CardTitle>
                            {restaurant.name}
                        </CardTitle>
                        <h2 className={` font-medium mr-3 ${isOpen ? 'text-green-700' : 'text-red-700'}`}>
                            {restaurant.status}
                        </h2>
                    </div>
                    <div className='flex items-center gap-2'>
                        <h2>
                            {restaurant.address}
                        </h2>
                        <div className='h-2 w-2 bg-gray-300 rounded-full mt-1' />
                        <CardDescription className='text-base flex items-center'>
                            <PhilippinePesoIcon className='h-[14px] w-3' /> 44
                        </CardDescription>
                    </div>
                    <CardDescription>
                        {restaurant.description}
                    </CardDescription>
                </CardContent>
            </Card>
        </Link>
    )
}

export default Restaurant