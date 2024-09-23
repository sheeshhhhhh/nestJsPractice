import { ChangeEvent, Dispatch, SetStateAction } from "react"
import { FormRestaurant, RestaurantLocation } from "../../../types/restaurant.types"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import LoadingSpinner from "../../common/LoadingSpinner"


type RestaurantInfoFieldsProps = {
    restaurantInfo: FormRestaurant,
    setRestaurantInfo: Dispatch<SetStateAction<FormRestaurant>>,
    latlng: Partial<RestaurantLocation>
}

const RestaurantInfoFields = ({
    latlng,
    restaurantInfo,
    setRestaurantInfo
}: RestaurantInfoFieldsProps) => {
    
    const changeEvent = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if(!(name in restaurantInfo)) {
            return
        }
        
        setRestaurantInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if(!restaurantInfo) return (
        <div className="w-[500px] flex flex-col gap-5">
            <LoadingSpinner className="mt-10 h-8 w-8" />
        </div>
    )

    return (
        <div className="w-[500px] flex flex-col gap-5">
            <h2 className="font-bold text-2xl mb-6">
                Restaurant Info
            </h2>
            <div>
                <Input 
                placeholder="restaurant Name"
                value={restaurantInfo.name}
                name="name"
                onChange={changeEvent}
                />
            </div>

            <div>
                <Input 
                placeholder="restaurant Address"
                value={restaurantInfo.address}
                name="address"
                onChange={changeEvent}
                />
            </div>
            <div>
                <Textarea 
                placeholder="Description(optional)"
                value={restaurantInfo.description}
                name="description"
                onChange={changeEvent}
                />
            </div>
            <div>
                <Input 
                placeholder="Email"
                value={restaurantInfo.email}
                name="email"
                onChange={changeEvent}
                />
            </div>
            <div>
                <Input
                placeholder="phone no."
                value={restaurantInfo.phoneNumber}
                type="number" 
                name="phoneNumber"
                onChange={(e) => setRestaurantInfo(prev => ({...prev, phoneNumber: e.target.valueAsNumber}))}
                />
            </div>
            <Input // make this a select with other later on
            placeholder="cuisine type(optional)"
            value={restaurantInfo.cuisineType}
            name="cuisineType"
            onChange={changeEvent}
            />
            <div>
                <Input 
                placeholder="Delivery Range"
                value={restaurantInfo.DeliveryRange}
                name="DeliveryRange"
                onChange={changeEvent}
                />
            </div>
            <div>
                <h2 className="font-bold text-lg"> Map Coordinates </h2>
                <div>
                    <Label htmlFor="latitude">
                        Latitude
                    </Label>
                    <Input
                    id="latitude"
                    value={latlng.latitude}
                    />
                </div>
                <div>
                <Label htmlFor="longitude">
                        Longitude
                    </Label>
                    <Input 
                    id="longitude"
                    value={latlng.longitude}
                    />
                </div>
            </div>
        </div>
    )
}

export default RestaurantInfoFields