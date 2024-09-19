import { Link } from "react-router-dom"
import { CartItems } from "../../../context/CartContext"
import { Dispatch, SetStateAction } from "react"
import { PhilippinePeso } from "lucide-react"

type CartCardProps = {
    cartItem: CartItems,
    setOpen: Dispatch<SetStateAction<boolean>>
}

const CartCard = ({
    cartItem,
    setOpen
}: CartCardProps) => {


    return (
        <Link 
        to={`/editCart/${cartItem.id}`}
        onClick={() => setOpen(false)}
        className="flex items-center gap-3"
        >
            <div>
            <img 
            className="max-w-[80px] max-h-[80px] rounded-lg"
            width={80}
            src={cartItem.menu.HeaderPhoto} 
            />
            </div>
            <div className="max-w-[230px] w-full h-full">
                <h2 className="font-medium">
                    {cartItem.menu.name}
                </h2>
                <p className="text-muted-foreground">
                    {cartItem.menu.description}
                </p>
            </div>
            <div className="flex items-center font-medium">
                <PhilippinePeso size={16} />
                {cartItem.price * cartItem.quantity}
            </div>
        </Link>
    )
}

export default CartCard