import { Link } from "react-router-dom"
import { MenuInfo } from "../../../types/menu.types"
import { PhilippinePesoIcon, PlusIcon } from "lucide-react"

type MenuCardProps = {
    menu: MenuInfo
}

const MenuCard = ({
    menu
}: MenuCardProps) => {
  

    return (
        <Link 
        to={`/menu/${menu.id}`}
        className="py-4 px-2 flex border-b-2">
            <div className="w-full max-w-[814px]">
                <h2 className="font-medium text-xl">
                    {menu.name}
                </h2>
                <div className="flex items-center gap-1">
                    <PhilippinePesoIcon size={18} />
                    <p>
                        <span>{menu.price}</span>
                    </p>
                </div>
                {
                    menu.description && 
                    <p className="text-muted-foreground py-2 max-h-[100px]">
                        {menu.description}
                    </p>
                }
            </div>
            <div className="relative size-[108px]">
                <img 
                width={120}
                height={120}
                src={menu.HeaderPhoto}
                className="size-[108px] rounded-lg"
                />
                <div 
                className="absolute size-[30px] flex justify-center items-center rounded-full bg-white
                bottom-1 right-2
                ">
                    <PlusIcon className="" />
                </div>
            </div>
        </Link>
    )
}

export default MenuCard