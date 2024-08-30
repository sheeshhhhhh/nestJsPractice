import { RestaurantLocation } from "../../../types/restaurant.types"
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Textarea } from "../../ui/textarea"

type FormRestaurant = {
    name: string,
    address: string,
    description?: string,
    email: string,
    phoneNumber: number,

    cuisineType?: string,
    DeliveryRange: string,
} & RestaurantLocation

const Form = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormRestaurant>()

    const SubmitForm:SubmitHandler<FormRestaurant> = (RestaurantInfo) => {
        // handle the data here later
    }

    return (
        <form
        className="max-w-[500px]"
        onSubmit={handleSubmit(SubmitForm)}
        >   
            <Input 
            placeholder="restaurant Name"
            {...register('name', { required: true })}
            />
            {errors?.name?.type === 'required' && <h2>username is required</h2>}

            <Input 
            placeholder="restaurant Address"
            {...register('address', { required: true })}
            />
            {errors?.address?.type === 'required' && <h2>address is required</h2>}

            <Textarea 
            placeholder="Description"
            {...register('description')}
            />

            <Input 
            placeholder="Email"
            {...register('email', {
                required: true,
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}/i
            })}
            />
            {errors?.email?.type === 'required' && <h2>email is required</h2>}
            {errors?.email?.type === 'pattern' && <h2>please provide a real email</h2>}

            <Input
            placeholder="phone no."
            type="number" 
            {...register('phoneNumber', {
                required: true
            })}
            />
            {errors?.email?.type === 'required' && <h2>phone no. is required</h2>}

            <Input // make this a select with other later on
            placeholder="cuisine type"
            {...register('cuisineType')}
            />

            <Input 
            placeholder="Delivery Range"
            {...register('DeliveryRange', {
                required: true,
                pattern: /^[0-9]{3,}(km|mi)$/i
            })}
            />
            {errors?.DeliveryRange?.type === 'required' && <h2>DeliveryRange is required</h2>}
            {errors?.DeliveryRange?.type === 'pattern' && <h2>please provide a real range</h2>}

            {/* implement map here later */}

            <Button
            className="mt-5"
            type="submit"
            >
                Register
            </Button>
        </form>
    )
}

export default Form