import LoadingSpinner from "@/components/common/LoadingSpinner"
import GoogleMaps from "@/components/PageComponents/CreateRestaurant/GoogleMaps"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/context/AuthContext"
import { RestaurantLocation } from "@/types/restaurant.types"
import apiClient from "@/util/apiClient"
import { useState } from "react"
import toast from "react-hot-toast"

const SetLocation = () => {
    const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [latLng, setLatLng] = useState<Partial<RestaurantLocation>>({
        latitude: undefined,
        longitude: undefined,
    })

    const { user } = useAuthContext()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            // the id comes from the accessToken that we provide
            const response = await apiClient.post('/user/setLocation', {
                ...latLng,
                address
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            const data = response.data
            console.log(data)
            // if(data) {
            //     // if successful
            //     toast.success('Successfully set location')
            //     return window.location.assign(`/`)
            // }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form 
        onSubmit={handleSubmit}
        className="mx-auto max-w-[700px] w-full flex flex-col gap-4">
            <div aria-label="set Location Header" >
                <h2 className="font-bold text-3xl">Please Set Your Location</h2>
                <p className="text-lg fong-medium">
                    in order for you to use our app please set your location,
                    don't worry we won't share your location to anyone. and this is only use
                    when delivering and calculating distance of restaurants
                </p>
            </div>
            <GoogleMaps 
            className="rounded-lg"
            latlng={latLng}
            setLatLng={setLatLng}
            RestaurantName="Your Location"
            />
            <div className="flex gap-3 justify-between items-center">
                <div className="w-full">
                    <Label htmlFor="latitude" >
                        Latitude
                    </Label>
                    <Input 
                    className="mt-1"
                    id="latitude"
                    value={latLng.latitude}
                    />
                </div>
                <div className="w-full">
                    <Label htmlFor="latitude" >
                        Longtitude
                    </Label>
                    <Input
                    className="mt-1" 
                    id="longtitude"
                    value={latLng.longitude}
                    />
                </div>
            </div>
           <div>
                <h2 className="font-semibold text-2xl mb-1">
                    Address
                </h2>
                <Textarea 
                className="resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="plase enter your address (required)"
                />
            </div>
            <Button
            disabled={loading}
            type='submit'
            >
                {loading ? <LoadingSpinner /> : "Submit"}
            </Button>
        </form>
    )
}

export default SetLocation