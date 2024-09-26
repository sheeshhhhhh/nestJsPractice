import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import apiClient from "@/util/apiClient"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import LoadingSpinner from "../LoadingSpinner"
import StarNumberForm from "./StarNumberForm"
import { RestaurantWithCategories } from "@/types/restaurant.types"

export type reviewInfoType = {
    rating: number,
    comment: string,
}

const AddReview = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [reviewInfo, setReviewInfo] = useState<reviewInfoType>({
        rating: 0,
        comment: ''
    })

    const queryClient = useQueryClient();
    const { id:restaurantId } = useParams()

    const { mutate: addReview, isPending } = useMutation({
        mutationKey: ['addreview'],
        mutationFn: async () => {
            const response = await apiClient.post('/review', {
                ...reviewInfo,
                restaurantId
            })
            if(response.status >= 400) {
                throw new Error(response.data.message);
            }
            return response.data
        },
        onSuccess: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['restaurant'] })
            await queryClient.setQueryData(['restaurant'], (oldData: RestaurantWithCategories) => {

                return {
                    ...oldData,
                    reviews: oldData?.reviews ? [...oldData.reviews, data] : [data] // adding data
                }
            })
            setOpen(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Add Review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Review
                    </DialogTitle>
                    <DialogDescription>
                        you can only have one review per restaurant. you can edit and delete it any time
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <StarNumberForm rating={reviewInfo.rating} setReviewInfo={setReviewInfo}  />
                    <Textarea 
                    value={reviewInfo.comment}
                    onChange={(e) => setReviewInfo(prev => ({...prev, comment: e.target.value}))}
                    placeholder="describe your experience" />
                </div>
                <Button
                disabled={isPending}
                onClick={() => addReview()}
                >
                    {!isPending ? "Submit Review" : <LoadingSpinner />}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default AddReview