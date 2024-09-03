import toast from "react-hot-toast"
import { useAuthContext } from "../../../context/AuthContext"
import apiClient from "../../../util/apiClient"
import apiErrorHandler from "../../../util/apiErrorHandler"
import FormDataSetter from "../CreateRestaurant/FormData.Setter"
import { FormRestaurant, RestaurantLocation, RestaurantOpeningHours } from "../../../types/restaurant.types"
import HeaderPhotoInput from "../CreateRestaurant/HeaderPhotoInput"

type updateType = {
    openingHours: RestaurantOpeningHours,
    file: any,
    latlng: Partial<RestaurantLocation>
} & FormRestaurant

const updateRestaurant = () => {  
    const { user } = useAuthContext()
    const update = async ({
        latlng,
        file,
        openingHours,
        name,
        address,
        email,
        phoneNumber,
        DeliveryRange,
        description,
        cuisineType
    }: updateType) => {
        if(!latlng.latitude || !latlng.longitude) {
            return toast.error('latitude and longitude are required')
        }

        if(!file) {
            return toast.error('Header Photo is required')
        }

        if(!openingHours.closed || !openingHours.open) {
            return toast.error('Opening hours is required')
        }

        if(!name || !address || !email || !phoneNumber || !DeliveryRange) {
            return toast.error('some fields are required')
        }

        const formData = FormDataSetter({
            name, address, email, phoneNumber, DeliveryRange, description, cuisineType,
            HeaderPhoto: file,
            ...latlng,
            openingHours
        })
        // request
        const response = await apiClient.patch('/restaurant/' + user?.restaurant?.id, formData,
            {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                },
                validateStatus: () => true
            }
        )

        // error handling
        if(response.status >= 400) {
            const message = response.data.message;
            const error = response.data.error;
            return apiErrorHandler({
                error: error,
                status: response.status,
                message: message
            })
        }

        toast.success('updated Restaurant')
        return response.data
    }

  return { update }
}

export default updateRestaurant