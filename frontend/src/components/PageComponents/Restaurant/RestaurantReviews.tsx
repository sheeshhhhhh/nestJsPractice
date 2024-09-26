import AvatarProfile from "@/components/common/AvatarProfile"
import AddReview from "@/components/common/Review/AddReview"
import DeleteReview from "@/components/common/Review/DeleteReview"
import ShowStarNumber from "@/components/common/Review/showStarNumber"
import UpdateReview from "@/components/common/Review/UpdateReview"
import { Card } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthContext"
import { Reviews } from "@/types/review.type"
import { format } from 'date-fns'

export type RestaurantReviewsProps = {
  reviews?: Reviews
}

const RestaurantReviews = ({
  reviews
}: RestaurantReviewsProps) => {
  
  const { user } = useAuthContext()
  const userReview = reviews?.find(review => review.userId === user?.id)
  const userHadReview = Boolean(userReview)

  // do not render if there is nothing 
  if(!reviews || reviews.length === 0) return (
    <div className="py-3 w-full flex justify-end">
      {userReview ? 
      <UpdateReview 
      initialValues={{
        comment: userReview.comment,
        rating: userReview.rating
      }} 
      reviewId={userReview.id}
      /> 
      : 
      <AddReview />}
    </div>
  )

  return (
    <div className="py-4 overflow-hidden">
      <div>
        {
          userReview ? 
            <UpdateReview 
            initialValues={{
              comment: userReview.comment,
              rating: userReview.rating
            }} 
            reviewId={userReview.id}
            /> 
            : 
            <AddReview />
        }
      </div>
      {/* style the scrollbar later */}
      <div className="flex w-full overflow-x-auto gap-4 pb-2 px-1">
        {reviews.map(review  => {
          const isAuthor = review.userId === user?.id

          return (
            <Card key={review.id} className="w-[400px] shadow-lg p-4 flex-shrink-0">
              <div className="flex justify-between items-center">
                <ShowStarNumber rating={review.rating} />
                <h2 className="text-muted-foreground text-sm font-medium">
                  {format(new Date(review.createdAt), 'PPP')}
                </h2>
              </div>
              <p className="my-1 max-w-[350px] p-2">
                {review.comment}
              </p>
              <div className="flex gap-2 items-center">
                <AvatarProfile 
                src={review.user.userInfo.profile}
                className=""
                />
                <h2 className="font-semibold">
                  {review.user.name}
                </h2>
                <div className="ml-auto">
                  <DeleteReview reviewId={review.id} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default RestaurantReviews