import { createContext, useContext, useEffect, useState, PropsWithChildren, Dispatch, SetStateAction} from "react";
import apiClient from "../util/apiClient";
import { MenuInfo } from "../types/menu.types";
import apiErrorHandler from "../util/apiErrorHandler";
import toast from "react-hot-toast";

type RestaurantForCart = {
    name: string,
    address: string,
    Headerphoto: string,
    email: string,
    latitude: number,
    longitude: number
}

type Cart = {
    id: string,
    restaurantId: string,
    userId: string,

    cartItems: CartItems[],

    restaurant: RestaurantForCart,

    createdAt: Date,
    updatedAt: Date
}

type CartItems = {
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

    useEffect(() => {
        const getCart = async () => {
            setLoading(true)
            try {
                const response = await apiClient.get('/cart')

                if(response.status >= 400) {
                    const message = response.data.message;
                    const error = response.data.error;
                    return apiErrorHandler({ error, message, status:response.status })
                }
                setCart(response.data)
            } catch (error: any) {
                toast.error(error.message)
            } finally {
                setLoading(false)
            }
        }
        getCart()
    }, [])

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