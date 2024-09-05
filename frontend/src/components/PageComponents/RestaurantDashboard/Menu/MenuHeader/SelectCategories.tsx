import { Dispatch, SetStateAction } from "react"
import { MenuForm } from "../../../../../types/menu.types"
import { useAuthContext } from "../../../../../context/AuthContext"
import { useQuery } from "@tanstack/react-query"
import apiClient from "../../../../../util/apiClient"
import { category } from "../../../../../types/restaurant.types"
import apiErrorHandler from "../../../../../util/apiErrorHandler"
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../../../ui/select'

type SelectCategoriesProps = {
    menuInfo: MenuForm,
    setMenuInfo: Dispatch<SetStateAction<MenuForm>>
}

const SelectCategories = ({
    menuInfo,
    setMenuInfo
}: SelectCategoriesProps) => {

    // getting all the categories
    const { user } = useAuthContext()
    const { data: Category } = useQuery({
        queryKey: ['category'],
        queryFn: async () => {
            const response = await apiClient.get(`/category/${user?.restaurant?.id}`, {
                validateStatus: () => true
            })

            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status: response.status })
            }
            return response.data as category[]
        },
        retry: false
    })

    // handling the select event
    const changeCategory = (categoryId: string) => {
        setMenuInfo(prev => ({
            ...prev,
            categoryId: categoryId
        }))
    }

    return (
        <Select value={menuInfo.categoryId} onValueChange={(value) => changeCategory(value)}>
            <SelectTrigger>
                <SelectValue placeholder={'categories'} />
            </SelectTrigger>
            <SelectContent>
                {Category?.map((category) => {
                    return (
                        <SelectItem 
                        value={category.id}>{category.CategoryName}</SelectItem>
                    )
                })}
            </SelectContent>
        </Select>
    )

}

export default SelectCategories