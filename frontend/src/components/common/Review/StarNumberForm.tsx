import { Dispatch, SetStateAction } from "react"
import { reviewInfoType } from "./AddReview"
import { StarIcon } from "lucide-react"

type StarNumberFormProps = {
    rating: number,
    setReviewInfo: Dispatch<SetStateAction<reviewInfoType>>
}

const StarNumberForm = ({
    rating,
    setReviewInfo
}: StarNumberFormProps) => {

    const changeRating = (newRating: number) => {
        setReviewInfo(prev => ({
            ...prev,
            rating: newRating
        }))
    }

    return (
        <div className="flex gap-2 mb-2">
            {Array(5).fill(undefined).map((itemvalue, index) => {
                const value = index + 1
                const shouldFill = rating >= value

                return (
                    <StarIcon 
                    key={itemvalue} // just put here so that vite can build
                    onClick={() => changeRating(value)}
                    style={{
                        fill: shouldFill ? 'hsl(240 5.9% 10%)' : '',
                        color: shouldFill ? 'hsl(240 5.9% 10%)' : 'hsl(240 3.8% 46.1%)'
                    }}
                    size={40} />
                )
            })}
        </div>
    )
}

export default StarNumberForm