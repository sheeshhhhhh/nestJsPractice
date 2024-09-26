import { Button } from "@/components/ui/button"
import apiClient from "@/util/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import LoadingSpinner from "../LoadingSpinner"
import { RestaurantWithCategories } from "@/types/restaurant.types"

type DeleteReviewProps = {
    reviewId: string
}

const DeleteReview = ({
    reviewId
}: DeleteReviewProps) => {
    
    const queryClient = useQueryClient();
    const { mutate: deleteReview, isPending } = useMutation({
        mutationKey: ['deleteReview'],
        mutationFn: async () => {
            const response = await apiClient.delete(`/review/${reviewId}`)
            
            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onSuccess: async () => {
            await queryClient.cancelQueries({ queryKey: ['restaurant'] });
            await queryClient.setQueryData(['restaurant'], (oldData: RestaurantWithCategories) => {
                return {
                    ...oldData,
                    reviews: oldData.reviews?.filter((review) => review.id !== reviewId)
                }
            })
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    
    return (
        <Button
        variant={'destructive'}
        size={'sm'}
        onClick={() => deleteReview()}
        disabled={isPending}
        >
            {isPending ? <LoadingSpinner /> : "Delete"}
        </Button>
    )
}

export default DeleteReview