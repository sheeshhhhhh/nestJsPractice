import toast from "react-hot-toast"
import { RestaurantLocation } from "../../../types/restaurant.types"
import { FormRestaurant } from "./Form"

type FormDataSetterParams = {
  HeaderPhoto: any
} & FormRestaurant & Partial<RestaurantLocation>

const FormDataSetter = ({
  name, address, description, email, phoneNumber, cuisineType, DeliveryRange,
  latitude, longitude, HeaderPhoto
} : FormDataSetterParams) => {

  if(!latitude || !longitude) {
    return toast.error('please select your location in the map')
}

  const formData = new FormData()
  formData.append('name', name)
  formData.append('address', address)
  description && formData.append('description', description)
  formData.append('phoneNumber', phoneNumber.toString())
  formData.append('email', email)
  cuisineType && formData.append('cuisineType', cuisineType)
  formData.append('DeliveryRange', DeliveryRange)
  formData.append('latitude', latitude.toString())
  formData.append('longitude', longitude.toString())
  formData.append('HeaderPhoto', HeaderPhoto)
  
  return formData
}

export default FormDataSetter