import { useQuery } from "@tanstack/react-query"
import { useAuthContext } from "../../../../context/AuthContext"
import { MenuInfo, MenuInfoCategory } from "../../../../types/menu.types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../ui/table"
import apiClient from "../../../../util/apiClient"
import apiErrorHandler from "../../../../util/apiErrorHandler"
import LoadingSpinner from "../../../common/LoadingSpinner"
import MenuSettings from "./MenuSettings"

const MenusCollection = () => {

    const { user } = useAuthContext()
    const { data: Menus, isLoading } = useQuery({
        queryKey: ['menus'],
        queryFn: async () => {
            const response = await apiClient.get(`/menu/getAll/${user?.restaurant?.id}`, {
                validateStatus: () => true
            })
            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                apiErrorHandler({ error, message, status: response.status })
                return []
            }
            return response.data as MenuInfo[]
        }
    })

    if(isLoading) {
        return (
        <div>
            <LoadingSpinner />
        </div>
        )
    }

    if(!Menus) { 
        return null
    }

    return (
        <Table className="mt-5">
            <TableHeader>
                <TableRow>
                    <TableHead>name</TableHead>
                    <TableHead>category</TableHead>
                    <TableHead>availability</TableHead>
                    <TableHead>price</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Menus.map((menu) => (
                    <MenuCard menu={menu} />
                ))}
            </TableBody>
        </Table>
    )
}

type MenuCardProps = {
    menu: MenuInfoCategory  
}

const MenuCard = ({
    menu
}: MenuCardProps) => {
    const availability = menu.availability ? 'available' : 'not available'

    return (
        <TableRow key={menu.id}>
            <TableCell>{menu.name}</TableCell>
            <TableCell>{menu?.category?.CategoryName}</TableCell>
            <TableCell
            className={menu.availability ? '' : 'text-red-500'}
            >{availability}</TableCell>
            <TableCell>{menu.price}</TableCell>
            <TableCell><MenuSettings menu={menu} /></TableCell>
        </TableRow>
    )
}

export default MenusCollection