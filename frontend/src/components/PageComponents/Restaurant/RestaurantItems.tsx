import { Link } from "react-router-dom"
import { RestaurantWithCategories } from "../../../types/restaurant.types"

type RestaurantItemsProps = {
    restaurant: RestaurantWithCategories
}

const RestaurantItems = ({
    restaurant
}: RestaurantItemsProps) => {

    const categories = restaurant.categories

    return (
        <div className="p-4 mt-5">
            {/* Make a Carousel like link so that you can automatically direct it to them */}
            <div className="flex h-[50px] gap-4 bg-white items-center">
                {categories?.map((category) => {

                    // do the style later on                    
                    return (
                        <a 
                        href={`#${category.id}`}
                        className={``}
                        >
                            <h2 className="font-bold text-3xl mx-5">
                                {category.CategoryName}
                            </h2>
                        </a>
                    )
                })}
            </div>
            {/* just map the categories and map the menu's within categories */}
            <div className="flex flex-col gap-3">
                {categories?.map((category) => {
                    return (
                        <div 
                        className="p-2 " 
                        id={category.id}>
                            <h2 className="my-2 font-bold text-2xl">
                                {category.CategoryName}
                            </h2>
                            <div>
                                {category.menu.map((menu) => {
                                    return <h2>{menu.name}</h2>
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default RestaurantItems