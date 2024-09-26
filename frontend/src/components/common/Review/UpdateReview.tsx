import { useState } from "react"
import { reviewInfoType } from "./AddReview"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "@/util/apiClient"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import StarNumberForm from "./StarNumberForm"
import { Textarea } from "@/components/ui/textarea"
import LoadingSpinner from "../LoadingSpinner"
import { RestaurantWithCategories } from "@/types/restaurant.types"


export type UpdateReviewProps = {
    initialValues: reviewInfoType,
    reviewId: string
}

const UpdateReview = ({
    initialValues,
    reviewId
}: UpdateReviewProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [reviewInfo, setReviewInfo] = useState<reviewInfoType>(initialValues || {
        rating: 0,
        comment: ''
    })

    const queryClient = useQueryClient();

    const { mutate: addReview, isPending } = useMutation({
        mutationKey: ['updateReview'],
        mutationFn: async () => {
            const response = await apiClient.patch(
                `/review/${reviewId}`, 
                reviewInfo,
            )
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
                    reviews: oldData?.reviews?.map(review => {
                        if(review.id === reviewId) {
                            return data
                        }

                        return review
                    })
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
                    Edit Review
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Review
                    </DialogTitle>
                    <DialogDescription>
                        you can reedit the changes that you made and also delete it anytime.
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

export default UpdateReview