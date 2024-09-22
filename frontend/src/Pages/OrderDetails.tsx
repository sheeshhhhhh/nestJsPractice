import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import LoadingSpinner from "../components/common/LoadingSpinner"
import apiErrorHandler from "../util/apiErrorHandler"
import apiClient from "../util/apiClient"
import { Order } from "../types/order.types"
import { PhilippinePeso } from "lucide-react"
import { Separator } from "../components/ui/separator"
import { Button } from "../components/ui/button"
import { useRef } from "react"

import { useReactToPrint } from 'react-to-print'

const OrderDetails = () => {
    const { orderId } = useParams()
    const navigate = useNavigate()

    const { data: orderDetail, isLoading, isError } = useQuery({
        queryKey: ['orderDetails', orderId],
        queryFn: async () => {
            const response = await apiClient.get(`/restaurant/getOrderDetail/${orderId}`)
            if(response.status >= 400) {
                const message = response.data.message;
                const error = response.data.error;
                apiErrorHandler({ error, message, status: response.status })
                throw new Error(response.data.message)
            }

            return response.data as Order
        },
        refetchOnWindowFocus: false,
        retry: false
    }) 

    const updateStatus = async () => {
        const response = await apiClient.patch(`order/updateStatus/${orderId}`, {
            orderStatus: "Delivering"
        })

        if(response.status >= 400) {
            throw new Error(response.data.message)
        }
        
        navigate(`/Dashboard/dashboard`)
    }

    const componentToPrint = useRef<HTMLDivElement>(null)
    const handlePrint = useReactToPrint({
        content: () => componentToPrint.current,
    })

    if(isLoading) return <LoadingSpinner className="h-14 w-14 mt-9" />
    if(isError || !orderDetail) return <div>There was an error loading the data</div> // for now

    return (
        <div className="p-6 w-full max-w-[850px] mx-auto">
            <div 
            className="w-[800px] flex flex-col px-10 pt-8"
            ref={componentToPrint}>
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold font-sans">
                        {orderDetail?.restaurant?.name}
                    </h1>
                        <p className="text-lg font-semibold text-muted-foreground">
                        {orderDetail?.restaurant?.address}
                    </p>
                    <div>
                        <h2 className="font-bold text-2xl mb-1">
                            Contact Details
                        </h2>
                        <div className="flex justify-between text-lg text-muted-foreground ml-3">
                            <p>
                                Email:
                            </p>
                            <p>{orderDetail?.restaurant?.email}</p>
                        </div>
                        <div className="flex justify-between text-lg text-muted-foreground ml-3">
                            <p>
                                Phone Number:
                            </p>
                            <p>{orderDetail?.restaurant?.phoneNumber}</p>
                        </div>
                    </div>
                </div>
                <h2 className="font-bold text-2xl">
                    Order Details
                </h2>
                <div>
                    <div className="flex flex-col gap-1 mt-2 px-2">
                        <div className="flex justify-between font-medium text-lg">
                            <p>
                                Order ID:
                            </p>
                            <p>{orderDetail.id}</p>
                        </div>
                        <div className="flex justify-between font-medium text-lg text-muted-foreground">
                            <p>Order Status:</p>
                            <p>{orderDetail.status}</p>
                        </div>
                        <div className="flex justify-between font-medium text-lg text-muted-foreground">
                            <p>Order Date:</p>
                            <p>{new Date(orderDetail.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex justify-between font-medium text-lg text-muted-foreground">
                            <p>Payment Method:</p>
                            <p>{orderDetail.paymentMethod}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 className="font-bold text-2xl">
                        Order Items
                    </h2>
                    <div className="my-2">
                        {orderDetail.orderItems.map((item) => {
                            return (
                                <div className="flex justify-between items-center">
                                    <div className="flex gap-3">
                                        <h2 className="font-medium text-lg">
                                            {item.quantity}x
                                        </h2>
                                        <h2 className="font-medium text-lg">
                                            {item.menu.name}
                                        </h2>
                                    </div>
                                    <div className="flex items-center">
                                        <PhilippinePeso size={14} />
                                        <h2>
                                            {item.menu.price}
                                        </h2>
                                    </div>
                                </div>
                            )
                        })}
                        <Separator className="mt-3 h-[2px]" />
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                SubTotal: 
                            </h2>
                            <div className="flex items-center font-bold">
                                <PhilippinePeso size={20} />
                                <h2 className="text-xl">
                                    {orderDetail.subTotal}
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">
                                Delivery Fee: 
                            </h2>
                            <div className="flex items-center font-bold">
                                <PhilippinePeso size={20} />
                                <h2 className="text-xl">
                                    {orderDetail.deliveryFee}
                                </h2>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-2xl mt-2">
                            <h2 className="font-bold">
                                Total: 
                            </h2>
                            <div className="flex items-center font-bold">
                                <PhilippinePeso size={24} />
                                <h2 >
                                    {orderDetail.totalAmount}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div 
            className="flex justify-between mt-7"
            aria-label="footer">
                <Button
                onClick={() => handlePrint()}
                className="w-[200px]"
                >
                    Print
                </Button>
                <Button
                onClick={() => updateStatus()}
                className="w-[200px]"
                >
                    Done
                </Button>
            </div>
        </div>
    )
}

export default OrderDetails