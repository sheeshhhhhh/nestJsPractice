import { createContext, useContext, useEffect, useState, PropsWithChildren, Dispatch, SetStateAction } from "react";
import { OrderBasicInformation } from "../types/order.types";
import { useAuthContext } from "./AuthContext";
import apiClient from "../util/apiClient";
import toast from "react-hot-toast";

export type ContextValueType = {
    order: OrderBasicInformation | undefined,
    setOrder: Dispatch<SetStateAction<OrderBasicInformation | undefined>>,
    loading: boolean
}

const OrderContextInitialValue: ContextValueType = {
    order: undefined,
    setOrder: () => undefined,
    loading: true
}

const OrderContext = createContext<ContextValueType>(OrderContextInitialValue);


export const useOrderContext = () => {
    const context = useContext(OrderContext)
    return context
}

export const OrderContextProvider = ({ children }: PropsWithChildren) => {
    const [order, setOrder] = useState<OrderBasicInformation | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useAuthContext();

    useEffect(() => {        
        const getCurrentOrder = async () => {
            setLoading(true)
            try {   
                if(!user || user.role !== 'Customer') return
                const response = await apiClient.get('/order/getOrderContext')
                if(response.status >= 400) {
                    return 
                }
                setOrder(response.data)
            } catch (error) {
                toast.error('There was an error getting the order')
            } finally {
                setLoading(false)
            }    
        }
        getCurrentOrder()
    }, [user])

    const value = {
        order: order,
        setOrder: setOrder,
        loading: loading
    }

    return (
        <OrderContext.Provider value={value} >
            {children}
        </OrderContext.Provider>
    )

}    