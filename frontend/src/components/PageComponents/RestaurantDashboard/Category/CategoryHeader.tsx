import { useState } from "react"
import { Input } from "../../../ui/input"
import AddModal from "./AddModal"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import { useAuthContext } from "../../../../context/AuthContext"



const CategoryHeader = () => {
    const [categoryFilter, setCategoryFilter] = useState<string>('')
    const queryClient = useQueryClient();
    const { user } = useAuthContext()

    const { isLoading } = useQuery({
        queryKey: ['categories', categoryFilter],
        queryFn: async () => {
            const response = await apiClient.post(`/category/searchCategory/${user?.restaurant?.id}`, {
                search: categoryFilter
            })
            
            await queryClient.cancelQueries({ queryKey: ['categories'] })
            queryClient.setQueryData(['categories'], () => {
                return response.data
                
            })
        }
    })

    if(!isLoading) {
        console.log(';sdajdjad') // eme eme nalang nag rereklamo sa buid eh
    }

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