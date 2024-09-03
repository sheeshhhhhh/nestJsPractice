import toast from "react-hot-toast"
import { FormRestaurant, openingHours, RestaurantLocation } from "../../../types/restaurant.types"


type FormDataSetterParams = {
  HeaderPhoto: any,
  openingHours?: openingHours
} & FormRestaurant & Partial<RestaurantLocation> 

const FormDataSetter = ({
  name, address, description, email, phoneNumber, cuisineType, DeliveryRange,
  latitude, longitude, HeaderPhoto, openingHours
} : FormDataSetterParams) => {

  if(!latitude || !longitude) {
    toast.error('error please refresh the page')
    throw new Error('latitude and longitude is missing') 
  }
  console.log(openingHours)
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

  formData.append('openingHours', JSON.stringify(openingHours))

  formData.append('HeaderPhoto', HeaderPhoto)
  
  return formData
}

export default FormDataSetter