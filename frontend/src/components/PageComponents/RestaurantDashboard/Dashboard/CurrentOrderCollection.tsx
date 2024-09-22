import { PhilippinePesoIcon } from "lucide-react"
import { OrderBasicInformation } from "../../../../types/order.types"
import { Button } from "../../../ui/button"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../ui/table"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import toast from "react-hot-toast"

  

type CurrentOrderCollectionProps = {
    ordersCollection: OrderBasicInformation[] | []
}

const CurrentOrderCollection = ({
    ordersCollection
}: CurrentOrderCollectionProps) => {
    const queryClient = useQueryClient();

    const { mutate: updateStatus, isPending, variables } = useMutation({
        mutationKey: ['updateOrderStatus'],
        mutationFn: async (orderId: string) => {
            const response = await apiClient.patch(`order/updateStatus/${orderId}`, {
                orderStatus: "Delivering"
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }
            return orderId
        },
        onError(error) {
            toast.error(error.message)
        },
        onSuccess: async (orderId: string) => {
            await queryClient.cancelQueries({ queryKey: ['restaurantOrders']})
            queryClient.setQueryData(['restaurantOrders'], 
                (prevOrders: OrderBasicInformation[] | []) => {
                    return prevOrders.filter((order) => order.id !== orderId)
                }
            )
        }
    })     

    const totalNumberOrders = ordersCollection.length

    return (
        <Table>
            {totalNumberOrders === 0 && 
                <TableCaption className="text-xl mt-10 font-bold">
                    No Current Orders as of the moment
                </TableCaption>
            }
            <TableHeader>
                <TableRow className="font-bold">
                    <TableCell>Order ID</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell>Payment Status</TableCell>
                    <TableCell>Sub Total</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ordersCollection.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.paymentMethod}</TableCell>
                        <TableCell>{order.paymentStatus}</TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <PhilippinePesoIcon size={14} />
                                {order.subTotal}
                            </div>
                        </TableCell>
                        <TableCell>
                            <Button
                            // making sure the clicked specifir order is disabled
                            disabled={variables === order.id && isPending} 
                            onClick={() => updateStatus(order.id)}
                            >
                                Done
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default CurrentOrderCollection