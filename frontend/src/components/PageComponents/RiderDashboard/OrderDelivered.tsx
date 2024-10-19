import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import apiClient from "@/util/apiClient"
import { useMutation } from "@tanstack/react-query"
import toast from "react-hot-toast"

type OrderDeliveredProps = {
    orderId: string,
}

const OrderDelivered = ({
    orderId
}: OrderDeliveredProps) => {
    
    // provide some proof of delivery like a photo

    const { mutate, isPending } = useMutation({
        mutationKey: ['OrderDelivered'],
        mutationFn: async () => {
            const response = await apiClient.post(`/rider/updateStatus/${orderId}`, {
                orderStatus: "Delivered"
            })

            if(response.status >= 400) {
                toast.error(response.data.message)
            }

            return response.data
        },
        onSuccess: () => {
            // make a sort of animation of success order delvired or redirect
        }        
    })
    

    return (
        <div className="flex justify-center items-center">
            <Button
            className="max-w-[500px] w-full"
            disabled={isPending}
            onClick={() => mutate()} 
            >
                {isPending ? <LoadingSpinner /> : "Order Delivered"}
            </Button>
        </div>
    )
}

export default OrderDelivered