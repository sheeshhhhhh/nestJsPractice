import { createContext, useContext, useEffect, useState, PropsWithChildren, Dispatch, SetStateAction} from "react";
import apiClient from "../util/apiClient";
import { MenuInfo } from "../types/menu.types";
import apiErrorHandler from "../util/apiErrorHandler";
import { useAuthContext } from "./AuthContext";
import { useOrderContext } from "./OrderContext";

export type RestaurantForCart = {
    name: string,
    address: string,
    Headerphoto: string,
    email: string,
    latitude: number,
    longitude: number
}

export type Cart = {
    id: string,
    restaurantId: string,
    userId: string,

    cartItems: CartItems[],

    restaurant: RestaurantForCart,

    createdAt: Date,
    updatedAt: Date
}

export type CartItems = {
    id: string,
    cartId: string,
    menuId: string

    menu: MenuInfo,
    price: number,
    quantity: number,
    ifProductDoesnotExist: string,

    createdAt: Date
}

type ContextValueType = {
    cart: Cart | undefined,
    setCart: Dispatch<SetStateAction<Cart | undefined>>,
    loading: boolean
}

const CartContextInitialValue: ContextValueType = {
    cart: undefined,
    setCart: () => undefined,
    loading: true,
}

const CartContext = createContext<ContextValueType>(CartContextInitialValue)

export const useCartContext = () => {
    const Context = useContext(CartContext)
    return Context
}

export const CartContextProvider = ({
    children
}: PropsWithChildren) => {
    const [cart, setCart] = useState<Cart | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useAuthContext()
    
    useEffect(() => {
        const getCart = async () => {
            if(!user || user.role !== 'Customer') return
            setLoading(true)
            try {
                const response = await apiClient.get('/cart')
                setCart(response.data)
            } catch (errorResponse: any) {
                if(errorResponse.status >= 400) {
                    const message = errorResponse.response.data.message;
                    const error = errorResponse.response.data.error;
                    const status = errorResponse.status
                    return apiErrorHandler({ error, message, status })
                }
            } finally {
                setLoading(false)
            }
        }
        getCart()
    }, [user])

    const value = {
        cart: cart,
        setCart: setCart,
        loading: loading
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )

}