import { useState } from "react"
import { OrderItemForm } from "../../../Pages/Menu"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { PlusIcon, MinusIcon } from "lucide-react"
import apiClient from "../../../util/apiClient"
import apiErrorHandler from "../../../util/apiErrorHandler"
import toast from "react-hot-toast"
import { useCartContext } from "../../../context/CartContext"

type MenuOrderCountProps ={
    orderForm: OrderItemForm
}

const MenuOrderCount = ({
    orderForm
}: MenuOrderCountProps) => {
    const [orderCount, setOrderCount] = useState<number>(1)
    const { cart, setCart } = useCartContext()
    
    // just add to cart
    const addToCart = async () => {
        const response = await apiClient.post('/cart', {
            ...orderForm,
            quantity: orderCount
        })
        
        if(response.status >= 400) {
            const message = response.data.message;
            const error = response.data.error;
            return apiErrorHandler({ message, error, status:response.status })
        }
        toast.success('added to cart')
        if(cart?.restaurantId !== response.data.restaurantId) {
            setCart(response.data)
        } else {
            setCart(prev => ({
                ...response.data,
                cartItems: prev?.cartItems ? 
                    [...prev?.cartItems, ...response.data.cartItems] 
                : 
                    response.data.cartItems
            }))
        }
    }

    // should add warnign later on when ordering on a differenct restaurant
    return (
        <Card className="max-h-[150px] w-[280px]">
            <CardContent className="flex md:flex-col gap-3 p-4">
                <div className="flex gap-4 justify-center items-center">
                    <Button 
                    onClick={() => setOrderCount(prev => prev > 1 ? prev - 1 : 1)}
                    variant={'outline'} 
                    className="rounded-full w-[45px] h-[45px] p-0">
                        <MinusIcon size={30} />
                    </Button>
                    <h1 className="font-bold text-2xl">
                        {orderCount}
                    </h1>
                    <Button 
                    onClick={() => setOrderCount(prev => prev + 1)}
                    variant={'outline'}
                    className="rounded-full w-[45px] h-[45px] p-0">
                        <PlusIcon size={30}/>
                    </Button>
                </div>
                <Button
                onClick={() => addToCart()}
                >
                    Add to cart
                </Button>            
            </CardContent>
        </Card>
    )
}

export default MenuOrderCount