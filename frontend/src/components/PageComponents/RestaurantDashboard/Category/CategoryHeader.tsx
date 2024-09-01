import { useState } from "react"
import { Input } from "../../../ui/input"
import AddModal from "./AddModal"



const CategoryHeader = () => {
    const [categoryFilter, setCategoryFilter] = useState<string>('')

    return (
        <div className='flex justify-between mb-3'>
            <Input 
            className="w-[450px]"
            placeholder="Filter Category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <AddModal/>
        </div>
    )
}

export default CategoryHeader