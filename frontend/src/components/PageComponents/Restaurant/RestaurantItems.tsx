import { RestaurantWithCategories } from "../../../types/restaurant.types"
import { useRef, useState } from "react"
import MenuCard from "./MenuCard"

type RestaurantItemsProps = {
    restaurant: RestaurantWithCategories
}

const RestaurantItems = ({
    restaurant
}: RestaurantItemsProps) => {
    const [select, setSelect] = useState<number>(0)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const categories = restaurant.categories

    const next = (idx: number) => {
        setSelect(idx)


        // DO LATER!!!: need make it scroll in the menu but also the category navigation
        //make the scrolling behavior
        const selectedCategory = scrollContainerRef.current?.children[idx] as HTMLElement;
        selectedCategory?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
        })
    }

        
    return (
        <div className="">
            {/* Make a Carousel like link so that you can automatically direct it to them */}

                <div 
                ref={scrollContainerRef}
                className="max-h-[712px] flex bg-white items-center relative h-[60px] border-b-2 overflow-x-auto whitespace-nowrap scrollbar-hide" >
                    {categories?.map((category, idx) => {
                        // do the style later on                    
                        return (
                            <a 
                            href={`#${category.id}`}
                            className={`active:bg-muted h-full pt-2 w-[170px] text-center`}
                            >
                                <h2 
                                onClick={() => next(idx)}
                                className="font-bold text-3xl mx-2 h-full w-[154px]">
                                    {category.CategoryName}
                                </h2>
                            </a>
                        )
                    })}
                    <div 
                    style={{ transform: `translateX(${select * 100}%)`}}
                    className="absolute h-[5px] w-[170px] px-[20px] bottom-0 z-0 transition-transform ">
                        <div className="bg-muted-foreground rounded-full h-[5px]"/>
                    </div>
                </div>

            {/* just map the categories and map the menu's within categories */}
            <div 
            className="flex flex-col gap-3 p-4 max-h-[652px] overflow-y-auto smoothScroll scrollbar-hide">
                {categories?.map((category) => {
                    return (
                        <div 
                        className="p-2 " 
                        id={category.id}>
                            <h2 className="my-3 font-bold text-4xl">
                                {category.CategoryName}
                            </h2>
                            <div>
                                {category.menu.map((menu) => <MenuCard menu={menu} />)}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
export default RestaurantItems