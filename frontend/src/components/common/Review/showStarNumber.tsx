import { StarIcon } from "lucide-react"

type showStarNumberProps = {
    rating: number
}

const ShowStarNumber = ({
    rating
}: showStarNumberProps) => {
    return (
        <div className="flex items-center gap-1">
            <h2 className="font-bold text-lg">
                {rating}
            </h2>
            <div className="flex">
                {Array(5).fill(undefined).map((itemvalue, index) => {
                    const shouldFill = rating >= index + 1

                    return (
                        <StarIcon
                        key={itemvalue}
                        style={{
                            fill: shouldFill ? 'hsl(240 5.9% 10%)' : '',
                            color: shouldFill ? 'hsl(240 5.9% 10%)' : 'hsl(240 3.8% 46.1%)'
                        }}
                        />
                    )
                    
                })}
            </div>
        </div>
    )
}

export default ShowStarNumber