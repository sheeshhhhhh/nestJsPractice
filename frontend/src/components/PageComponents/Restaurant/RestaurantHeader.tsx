import { RestaurantWithCategories } from "../../../types/restaurant.types"
import { StarIcon } from "lucide-react"
import { Separator } from "../../ui/separator"

type RestaurantHeader = {
    restaurant: RestaurantWithCategories
}

const RestaurantHeader = ({ 
    restaurant
}: RestaurantHeader) => {

    const distancefromRestaurant = restaurant.restaurantDistance?.toFixed(2).toString() + 'km'
    // show the status where close or not
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
                <img 
                className="rounded-xl max-h-[150px] max-w-[150px]"
                src={restaurant.HeaderPhoto} />
                <h2 className="text-4xl font-bold">
                    {restaurant.name}
                </h2>
            </div>
            <div className="flex flex-col sm:flex-row mt-2">
                <div className="flex">
                    <h3 className="text-muted-foreground text-lg ml-8 font-medium">
                        {distancefromRestaurant} away
                    </h3>
                    <Separator orientation="vertical" className="mx-3 h-[28px]" />
                    <h3 className="text-lg flex items-center gap-3 font-medium">
                        <StarIcon /> 5.0 {'  '}
                        <span className="text-muted-foreground">
                            5000+ ratings
                        </span>
                    </h3>
                </div>
                <div className="flex mt-2 sm:mt-0">
                    <h3 className="text-muted-foreground text-lg ml-8 font-medium">
                        44.00 delivery
                    </h3>
                    <Separator orientation="vertical" className="mx-3 h-[28px]" />
                    <h3 className="text-muted-foreground text-lg ml-8 font-medium">
                        109.00 Minimum
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default RestaurantHeader