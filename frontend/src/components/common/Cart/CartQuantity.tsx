import { MinusIcon, PlusIcon } from "lucide-react"
import apiClient from "../../../util/apiClient"
import { Button } from "../../ui/button"
import { useCartContext } from "../../../context/CartContext"

type CartQuantityProps = {
    quantity: number,
    cartItemId: string
}

const CartQuantity = ({
    quantity,
    cartItemId
}: CartQuantityProps) => {
    const { cart, setCart } = useCartContext()

    const updateQuantity = async (quantity: number) => {
        if(!cartItemId) return 

        const response = await apiClient.patch(`/cart/${cartItemId}`, {
            quantity: quantity
        })

        //updatign the state
        if(cart?.cartItems) {
            setCart(() => ({
                ...cart,
                cartItems: [
                    ...cart.cartItems.map((cartItem) => {
                        if(cartItem.id === response.data.id) {
                            cartItem.quantity = response.data.quantity
                            return cartItem
                        }   
                        return cartItem
                    })
                ]   
            }))
        }
    } 

    const removeItem = async () => {
        const response = await apiClient.delete(`/cart/${cartItemId}`) 
        if(cart) {
            setCart(() => ({
                ...cart,
                cartItems: cart.cartItems.filter((cartitem) => cartitem.id !== response.data.id)
            }))
        }
    }
    return (
        <div className="rounded-lg flex flex-col items-center">
            <Button 
            onClick={() => quantity === 1 ? removeItem() : updateQuantity(quantity - 1)}
            className="size-[30px] p-0"
            variant={'outline'}>
                <MinusIcon size={10} className="h-[10px] w-[10px]" />
            </Button>
            <h2 className="font-bold ">
                {quantity}
            </h2>
            <Button 
            onClick={() => updateQuantity(quantity + 1)}
            className="size-[30px] p-0"
            variant={'outline'}>
                <PlusIcon size={10} className="h-[10px] w-[10px]" />
            </Button>
        </div>
    )
}

export default CartQuantity