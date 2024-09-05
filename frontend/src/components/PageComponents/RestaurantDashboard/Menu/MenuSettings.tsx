import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, 
    DropdownMenuSeparator, DropdownMenuTrigger } from "../../../ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import MenuAvailability from "./MenuAvailability"
import { MenuInfo } from "../../../../types/menu.types"
import DeleteMenu from "./DeleteMenu"
import UpdateMenu from "./UpdateMenu"

type MenuSettingsProps = {
    menu: MenuInfo
}
const MenuSettings = ({
    menu
}: MenuSettingsProps) => {
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
                <MenuAvailability menuId={menu.id} menuAvailability={menu.availability} />
                <DeleteMenu menuId={menu.id} />
                <UpdateMenu menu={menu} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MenuSettings