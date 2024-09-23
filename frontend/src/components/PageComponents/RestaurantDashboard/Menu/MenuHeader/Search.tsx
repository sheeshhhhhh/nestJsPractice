import { useState } from "react"
import { Input } from "../../../../ui/input"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../../util/apiClient"
import { useAuthContext } from "../../../../../context/AuthContext"
import apiErrorHandler from "../../../../../util/apiErrorHandler"

const Search = () => {
    const [search, setSearch] = useState<string>('')
    // use debounce here later
    const { user } = useAuthContext();
    const restaurantId = user?.restaurant?.id;

    const queryClient = useQueryClient();
    const { isPending } = useQuery({
        queryKey: ['Menusearch', search],
        queryFn: async () => {
            const response = await apiClient.get(
                `/menu/searchMenu?${restaurantId && `restaurantId=${restaurantId}`}&search=${search}`
            )
            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status:response.status })
            }

            await queryClient.cancelQueries({ queryKey: ['menus'] })

            queryClient.setQueryData(['menus'], () => {
                return response.data
            })

            return response.data
        },
        refetchOnWindowFocus: false
    })

    return (
        <div>
            <Input 
            disabled={isPending}
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    )
}

export default Search