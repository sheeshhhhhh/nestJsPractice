import { useState } from "react"
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from "react-hot-toast"
import { Navigate } from "react-router-dom"
import { FormRestaurant, RestaurantLocation } from "../../../types/restaurant.types"
import apiClient from "../../../util/apiClient"
import HeaderPhotoInput from "../../common/HeaderPhotoInput"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Label } from "../../ui/label"
import { Textarea } from "../../ui/textarea"
import FormDataSetter from "./FormData.Setter"
import GoogleMaps from "./GoogleMaps"




const Form = () => {
    const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormRestaurant>()
    const [file, setFile] = useState<any>()
    const [latlng, setLatLng] = useState<Partial<RestaurantLocation>>({
        latitude: undefined, // 14.821306677310664
        longitude: undefined // 120.95972772542156
    })

    const SubmitForm:SubmitHandler<FormRestaurant> = async (RestaurantInfo) => {
        if(!file) {
            return toast.error('header Photo is required')
        }

        const newFormData = FormDataSetter({
            ...RestaurantInfo,
            HeaderPhoto: file,
            ...latlng
        })
        // make a request here 
        const response = await apiClient.post('/restaurant',
            newFormData,
            {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            }
        )
        if(response.status >= 400) {
            return toast.error(response.data.message)
        }
        return <Navigate to={'/Dashboard'} />
       
    }

    return (
        <form
        className="w-[1200px] h-auto space-y-4 flex gap-8 mx-auto"
        onSubmit={handleSubmit(SubmitForm)}
        >  
            <div className="w-[500px] flex flex-col gap-5">
                <h2 className="font-bold text-2xl mb-6">
                    Restaurant Info
                </h2>
                <div>
                    <Input 
                    placeholder="restaurant Name"
                    {...register('name', { required: true })}
                    />
                    {errors?.name?.type === 'required' && <h2 className='text-red-500 ml-2'>username is required</h2>}
                </div>

                <div>
                    <Input 
                    placeholder="restaurant Address"
                    {...register('address', { required: true })}
                    />
                    {errors?.address?.type === 'required' && <h2 className='text-red-500 ml-2'>address is required</h2>}
                </div>

                <div>
                    <Textarea 
                    placeholder="Description"
                    {...register('description')}
                    />
                </div>

                <div>
                    <Input 
                    placeholder="Email"
                    {...register('email', {
                        required: true,
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}/i
                    })}
                    />
                    {errors?.email?.type === 'required' && <h2 className='text-red-500 ml-2'>email is required</h2>}
                    {errors?.email?.type === 'pattern' && <h2 className='text-red-500 ml-2'>please provide a real email</h2>}
                </div>

                <div>
                    <Input
                    placeholder="phone no."
                    type="number" 
                    {...register('phoneNumber', {
                        required: true
                    })}
                    />
                    {errors?.email?.type === 'required' && <h2 className='text-red-500 ml-2'>phone no. is required</h2>}
                </div>

                <Input // make this a select with other later on
                placeholder="cuisine type"
                {...register('cuisineType')}
                />

                <div>
                    <Input 
                    placeholder="Delivery Range"
                    {...register('DeliveryRange', {
                        required: true,
                        pattern: /^[0-9]{2,}(km|mi)$/i
                    })}
                    />
                    {errors?.DeliveryRange?.type === 'required' && <h2 className='text-red-500 ml-2'>DeliveryRange is required</h2>}
                    {errors?.DeliveryRange?.type === 'pattern' && <h2 className='text-red-500 ml-2'>please provide a real range</h2>}
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

            <div className=" h-full flex flex-col item gap-3">

                <HeaderPhotoInput 
                file={file}
                setFile={setFile}
                size={{
                    height: 250,
                    width: 500
                }}
                />

                {/* implement map here later */}
                <div className="h-[350px] w-[500px]">
                    <GoogleMaps 
                    RestaurantName={getValues('name')}
                    latlng={latlng} 
                    setLatLng={setLatLng} />
                </div>

                <Button
                className="mt-5"
                type="submit"
                >
                    Register
                </Button>
            </div>
        </form>
    )
}

export default Form