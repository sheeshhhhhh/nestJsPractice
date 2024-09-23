import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams } from "react-router-dom"
import apiClient from "../util/apiClient"
import apiErrorHandler from "../util/apiErrorHandler"
import { useState } from "react"
import { OrderItemForm } from "./Menu"
import MenuCard from "../components/PageComponents/Menu/MenuCard"
import MenuOrderCount from "../components/PageComponents/Menu/MenuOrderCount"
import { useCartContext } from "../context/CartContext"
import toast from "react-hot-toast"

const EditCartItem = () => {
    const { cartItemId } = useParams()
    const { cart, setCart } = useCartContext() // for rerenders as a parameter in query keys

    const [orderForm, setOrderForm] = useState<OrderItemForm>({
        instruction: '',
        ifProductDoesnotExist: "Remove it from my order",
        menuId: '',
        restaurantId: '',
        price: 0 // gonna be set when the request come in
    })

    const { isLoading, data: cartItem} = useQuery({
        queryKey: ['cartItem', cartItemId, cart?.cartItems],
        queryFn: async () => {
            const response = await apiClient.get('/cart/getcartItem/'+ cartItemId)
            if(response.status >= 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status:response.status })
            }
            setOrderForm({
                instruction: response.data.instruction,
                ifProductDoesnotExist: response.data.ifProductDoesnotExist,
                menuId: response.data.menuId,
                restaurantId: response.data.menu.restaurantId,
                price: response.data.price  
            })
            return response.data
        }
    }) 

    const updateFunction = async (orderCount: number) => {

        // handle when the order count is 0 // user delete cart api

        const response = await apiClient.patch(`/cart/${cartItem.id}`, {
            instruction: orderForm.instruction,
            ifProductDoesnotExist: orderForm.ifProductDoesnotExist,
            price: orderForm.price,
            quantity: orderCount
        })

        if(response.status >= 400) {
            const message = response.data.message;
            const error = response.data.error;
            return apiErrorHandler({ error, message, status:response.status })
        }
        toast.success('cart updated')

        if(cart) {
            setCart(prev => ({
                ...cart,
                ...prev,
                cartItems: [...cart.cartItems.map((cartItem) => {
                    if(cartItem.id === response.data.id) {
                        return response.data
                    }
                    return cartItem
                })]
            }))
        }
    }

    if(isLoading) return null
    if(!cartItem) {
        return <Navigate to={`/`} />
    }

    return (
        <div className="max-w-[1100px] mx-auto py-8 flex gap-3">
            <MenuCard
            Menu={cartItem.menu} 
            orderForm={orderForm} 
            setOrderForm={setOrderForm}
            />
            <MenuOrderCount 
            initialCount={cartItem.quantity}
            callBackFunction={updateFunction}
            buttonText={'update cart Item'}
            />
        </div>
    )
}

export default EditCartItem