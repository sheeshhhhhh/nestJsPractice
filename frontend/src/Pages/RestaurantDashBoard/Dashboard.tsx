import { useQuery, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../util/apiClient"
import LoadingSpinner from "../../components/common/LoadingSpinner"
import apiErrorHandler from "../../util/apiErrorHandler"
import { useEffect } from "react"
import { io } from 'socket.io-client'
import { useAuthContext } from "../../context/AuthContext"
import { OrderBasicInformation } from "../../types/order.types"
import CurrentOrderCollection from "../../components/PageComponents/RestaurantDashboard/Dashboard/CurrentOrderCollection"
import CurrentOrderHeader from "../../components/PageComponents/RestaurantDashboard/Dashboard/CurrentOrderHeader"

const Dashboard = () => {
  const { user } = useAuthContext()
  const queryClient = useQueryClient();

  useEffect(() => {
    // this is use forlistening to the new orders
    const socket = io(import.meta.env.VITE_backendAPI_URL, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      query: {
        userId: user?.restaurant?.id
      }
    })
    socket.on('updateOrders', async (data: OrderBasicInformation) => {
      await queryClient.cancelQueries({ queryKey: ['restaurantOrders']})
      queryClient.setQueryData(['restaurantOrders'], (prevOrders: OrderBasicInformation[] | []) => {
        // to make sure that we don't have duplicate orders
        return prevOrders.find(prevdata => prevdata.id === data.id) ? [...prevOrders] : [data, ...prevOrders]
      })
    })
  }, []) 

  const { data: currentOrders, isLoading, isError } = useQuery({
    queryKey: ['restaurantOrders'],
    queryFn: async () => {
      const response = await apiClient.get('/restaurant/getOrders')
      if(response.status >= 400) {
        const message  = response.data.message;
        const error = response.data.error;
        apiErrorHandler({ error, message, status: response.status })
        return window.location.assign(import.meta.env.VITE_client_BASE_URL + '/error')
      }

      return response.data as OrderBasicInformation[] | []
    },
    refetchOnWindowFocus: false
  })
  
  if (isLoading) return <LoadingSpinner />
  if (isError || !currentOrders) return <div>There was an error loading the data</div> // for now

  return (
    <div className="p-3">
      <h2 className="font-bold text-4xl">
        Current Orders
      </h2>
      <p className="text-muted-foreground text-lg mt-2 mb-4">
        This is all the orders that is currently need to be processed. if it's done then it will disappear
      </p>
      <CurrentOrderHeader />
      <CurrentOrderCollection ordersCollection={currentOrders} />
    </div>
  )
}

export default Dashboard