
// this is only exclusive for customers and riders beacuse this is their communication
// line
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/context/AuthContext"
import apiClient from "@/util/apiClient"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { FormEvent, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Link, useParams } from "react-router-dom"
import { io } from "socket.io-client"
import { ArrowLeftIcon } from "lucide-react"

const Message = () => {
    const { orderId } = useParams()

    if(!orderId) {
         window.location.assign('/error')
        return 
    }

    const { user } = useAuthContext()
    const queryClient = useQueryClient()
    // we make a function instead of useEffect for reducing the rerenders
    const { data:messages, isPending:loading } = useQuery({
        queryKey: ['messages', orderId],
        queryFn: async () => {
            try {
                const response = await apiClient.get(`/order/orderMessages?orderId=${orderId}`, {
                })

                if(response.status >= 400) {
                    throw new Error(response.data.message);
                }

                return response.data as any[]
            } catch (error) {
                toast.error('an error occured. please refresh the page')
            }
        },
        refetchOnWindowFocus: false
    }) 

    useEffect(() => {
       const connectingToSOcket = async () => {
            const socket = await io('', {
                autoConnect: true,
                transports: ['websocket', 'polling'],
                query: {
                    userId: user?.role === "Rider" ? user?.rider?.id : user?.id
                }
            })
            socket.on('connect', () => {
                console.log('connected')
            })

            socket.on('message', async (data: any) => {
                console.log(data)
                await queryClient.cancelQueries({ queryKey: ['messages', orderId] })
                queryClient.setQueryData(['messages', orderId],(prev: any[]) => {
                    return prev ? [...prev, data] : [data]
                })
            })
            
            return () => {
                socket.disconnect()
            }
        }
        connectingToSOcket()
    }, [])

    return (
        <div className="flex flex-col p-4 max-w-[900px] mx-auto">
            <header className="border-b-2 mb-3 p-2">
                <Link to={user?.role === "Rider" ? "/Rider/CurrentOrder" : `/order/${orderId}`}>
                    <ArrowLeftIcon />
                </Link>
                <h2 className="font-bold text-2xl">
                    Messaging {user?.role === "Rider" ? "Customer" : "Rider"}
                </h2>
            </header>
            {loading ? 
            <div className="min-h-[600px] w-full overflow-y-scroll flex justify-center items-center">
                <div>
                    <LoadingSpinner className="h-10 w-10" />
                </div>
            </div>
            :
            <div className="min-h-[600px] w-full overflow-y-scroll scrollbar-hide">
                {messages?.map((message: any) => {
                    return (
                        <div
                        className={`my-1 w-full flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`rounded-full w-auto h-auto p-2 px-4 ${message.userId === user?.id ? 'bg-blue-600' : 'bg-slate-500'}`}>
                                <p className="text-white text-lg">
                                    {message.body}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>}
            <div className="my-2">
                <SendMessage orderId={orderId} userRole={user?.role} />
            </div>
        </div>
    )
}

type SendMesasgeProps = {
    orderId: string,
    userRole: string | undefined,
}

const SendMessage = ({
    orderId,
    userRole
}: SendMesasgeProps) => {
    const [message, setMessage] = useState<string>('')
    const queryClient = useQueryClient()

    if(!userRole) {
        return toast.error('an error occured. please refresh the page')
    }

    const Role = userRole === "Rider" ? "Rider" : "Customer" 

    const { mutate, isPending } = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: async (e: FormEvent) => {
            e.preventDefault()
            if(!message) throw new Error('cannot send empty message')
            const response = await apiClient.post(`/order/messageOrder${Role}/${orderId}`, {
                message
            })

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onSuccess: (data) => {
            toast.success('Message sent')

            queryClient.setQueryData(['messages', orderId], (prev: any[]) => {
                return prev ? [...prev, data] : [data]
            })

            setMessage('')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <form
        className="flex flex-col gap-2"
        onSubmit={e => mutate(e)} 
        >
            <Textarea 
            className="text-lg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="message" />
            <Button 
            className="w-full max-w-[250px]"
            disabled={isPending}
            type="submit">
                Submit
            </Button>
        </form>
    )

}

export default Message