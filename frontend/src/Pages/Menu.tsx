import { useQuery } from "@tanstack/react-query"
import { Link, useParams } from "react-router-dom"
import apiClient from "../util/apiClient"
import LoadingSpinner from "../components/common/LoadingSpinner"
import apiErrorHandler from "../util/apiErrorHandler"
import { MenuInfo } from "../types/menu.types"
import MenuCard from "../components/PageComponents/Menu/MenuCard"
import MenuOrderCount from "../components/PageComponents/Menu/MenuOrderCount"
import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import { useCartContext } from "../context/CartContext"
import toast from "react-hot-toast"

export type OrderItemForm = {
    instruction?: string,
    ifProductDoesnotExist: "Remove it from my order" | "Call me",
    menuId: string,
    restaurantId: string,
    price: number;
    // options: any // this is some fields
}

const Menu = () => {
    const { id } = useParams() // getting the menuId
    if(!id) return <h2>error</h2> // handle later

    const [orderForm, setOrderForm] = useState<OrderItemForm>({
        instruction: '',
        ifProductDoesnotExist: "Remove it from my order",
        menuId: id,
        restaurantId: '',
        price: 0 // gonna be set when the request come in
    })
    const { isLoading, data: Menu } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const response = await apiClient.get(`/menu/${id}`)

            if(response.status >= 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, status: response.status, message })
            }
            setOrderForm(prev => ({
                ...prev, 
                restaurantId: response.data.restaurantId,
                price: response.data.price
            }))
            return response.data as MenuInfo
        },
        refetchOnWindowFocus: false
    })

    const { cart, setCart } = useCartContext()
    
    const addToCart = async (orderCount: number) => {
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
            // checking if item is just getting updated and already exist
            const itemExist = cart?.cartItems.find((cartItem) => cartItem.id === response.data.cartItems[0].id)
            if(itemExist) {
                setCart(prev => ({
                    ...prev!, // cart item will exist if item exist look at the 72 line function
                    cartItems: 
                        prev!.cartItems && prev!.cartItems.map((cartItem) => {
                            // updating the item
                            if(cartItem.id === itemExist.id) {
                                return response.data.cartItems[0]
                            }
                            return cartItem
                        }) 
                }))
            } else {
                setCart(prev => ({
                    ...response.data,
                    ...prev,
                    cartItems: prev?.cartItems ? 
                        [...prev?.cartItems, ...response.data.cartItems] 
                    : 
                        response.data.cartItems
                }))
            }
        }
        window.history.back()
    }

    if(isLoading) return <LoadingSpinner />
    if(!Menu) {
        return <h2>Error</h2>
    }    

    return (
        <div className="max-w-[1100px] mx-auto py-8">
            <Link 
            className="flex font-medium gap-1 pb-2 hover:text-blue-600 hover:underline underline-offset-4"
            to={`/restaurant/${Menu.restaurantId}`}>
                <ChevronLeft />
                Go Back to restaurant
            </Link>
            <div className="flex gap-3">
                <MenuCard 
                orderForm={orderForm} 
                setOrderForm={setOrderForm}
                Menu={Menu}
                />
                <MenuOrderCount 
                callBackFunction={addToCart}
                buttonText="add to Cart"
                />
            </div>
        </div>
    )
}

export default Menu