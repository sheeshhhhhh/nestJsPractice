import { useEffect, useState } from "react"
import LoadingSpinner from "../components/common/LoadingSpinner"
import { Link, useSearchParams } from "react-router-dom"
import apiClient from "../util/apiClient"
import toast from "react-hot-toast"
import { ServerCrashIcon } from "lucide-react"

const PaymentSuccessful = () => {
    const [searchParams] = useSearchParams()
    const [error, setError] = useState()
    const [loading, setLoading] = useState<boolean>(true)
    const paymentIntendId = searchParams.get('payment_intent_id')
    

    useEffect(() => {
        const confirmPayment = async () => {
            setLoading(true)
            const response = await apiClient.get(`/order/${paymentIntendId}`)

            if(response.status > 400) {
                setError(response.data.message)
            } else if(response.data.success === false) {
                return setLoading(true)
            } else {
                // if payment is successful
                toast.success(response.data.message, { duration: 3000 })
                window.location.assign(`${import.meta.env.VITE_client_BASE_URL}/order/${response.data.data.id}`)
            }
            return setLoading(false)
        }   
        setInterval(() => confirmPayment(), 3000)
    }, [paymentIntendId])

    return (
        <div className="h-screen flex flex-col w-[800px] mx-auto p-10">
            {error && (
                <div className="w-full flex justify-center">
                    <ServerCrashIcon 
                    size={300}
                    className="text-muted-foreground"
                    />
                </div>
            )}
            <h2 className={`font-medium text-2xl ${error && 'text-red-600'} mx-auto`}>
                {
                error ? 
                <div>
                    {error} {" "}
                    <Link 
                    className="text-blue-600 text-lg underline-offset-4 hover:underline"
                    to={'/support'}>
                        please call Website Support
                    </Link>
                </div>
                : 
                "Processing order..."
                }
            </h2>
            
            {loading && <LoadingSpinner className="h-10 w-10 my-5" />}
        </div>
    )
}

export default PaymentSuccessful