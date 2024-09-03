import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { FormRestaurant, Restaurant, RestaurantLocation, RestaurantOpeningHours } from "../../../types/restaurant.types"
import { useAuthContext } from "../../../context/AuthContext"
import RestaurantInfoFields from "./RestaurantInfoFields"
import OpeningHoursField from "./OpeningHoursField"
import HeaderPhotoInput from "../CreateRestaurant/HeaderPhotoInput"
import GoogleMaps from "../CreateRestaurant/GoogleMaps"
import { Button } from "../../ui/button"
import updateRestaurant from "./updateRestaurant.hook"

type UpdateFormProps = {
    initialData: Restaurant
}

const UpdateForm = ({
    initialData
}: UpdateFormProps) => {
    const [restaurantInfo, setRestaurantInfo] = useState<FormRestaurant>({
        name: initialData.name,
        address: initialData.address,
        description: initialData.description || '',
        email: initialData.email,
        phoneNumber: initialData.phoneNumber,
        cuisineType: initialData.cuisineType || '',
        DeliveryRange: initialData.DeliveryRange
    })
    const [openingHours, setOpeningHours] = useState<RestaurantOpeningHours>({
        open: initialData.openingHours.open,
        closed: initialData.openingHours.closed
    })
    const [file, setFile] = useState<any>(initialData.HeaderPhoto || undefined)
    const [latlng, setLatLng] = useState<Partial<RestaurantLocation>>({
        latitude: initialData.latitude, // 14.821306677310664
        longitude: initialData.longitude // 120.95972772542156
    })

    const { update } = updateRestaurant()

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()

            update({
                openingHours,
                file,
                latlng,
                ...restaurantInfo
            })
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <form
    onSubmit={submitForm}
    className="w-[1200px] h-auto space-y-4 flex gap-8 mx-auto"
    >  
        <div>
            <RestaurantInfoFields 
            restaurantInfo={restaurantInfo}
            setRestaurantInfo={setRestaurantInfo}
            latlng={latlng} 
            /> 
            <OpeningHoursField
            openingHours={openingHours}
            setOpeningHours={setOpeningHours}
            />
        </div>
        <div className=" h-full flex flex-col item gap-3">
            <HeaderPhotoInput 
            file={file}
            setFile={setFile}
            size={{
                height: 350,
                width: 500
            }}
            iconSize={100}
            />
            {/* implement map here later */}
            <div className="h-[350px] w-[500px]">
                <GoogleMaps latlng={latlng} setLatLng={setLatLng} />
            </div>
            <Button
            className="mt-5"
            type="submit"
            >
                update
            </Button>
        </div>
    </form>
  )
}

export default UpdateForm