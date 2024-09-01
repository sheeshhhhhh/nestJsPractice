
import { MoreHorizontal } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../../../ui/dropdown-menu"
import DeleteCategory from "./DeleteCategory"
import UpdateCategory from "./UpdateCategory"
import { useState } from "react"
  
type CategoryMenuProps = {
    categoryId: string
}

const CategoryMenu = ({
    categoryId
}: CategoryMenuProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <DropdownMenu
        open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
                <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Settings</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DeleteCategory categoryId={categoryId} />
                <UpdateCategory categoryId={categoryId} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CategoryMenu