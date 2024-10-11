import CurrentOrder from "@/components/PageComponents/RiderDashboard/CurrentOrder"
import SideBar from "@/components/PageComponents/RiderDashboard/SideBar"
import { useAuthContext } from "@/context/AuthContext"
import apiClient from "@/util/apiClient"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { Route, Routes } from "react-router-dom"
import { io } from "socket.io-client"

const RiderDashboard = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthContext()

    useEffect(() => {
        const connectsocket = async () => {
            const socket = await io('', {
                autoConnect: true,
                transports: ['websocket', 'polling'],
                query: {
                    userId: user?.rider?.id
                }
            })
    
            // listen for riders location update
            navigator.geolocation.getCurrentPosition(async position => {
                const response = await apiClient.patch('/rider/updateGpsLocation', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            })
            
            socket.on('newOrder', async () => {
                // only use for invalidating queries so that it will request(fetch) again
                await queryClient.invalidateQueries({ queryKey: ['riderCurrentOrder']})
            })
    
            return () => {
                socket.disconnect()
            }
        }
        connectsocket()
    }, [navigator.geolocation.getCurrentPosition(position => position)])

    return (
        <div className="min-h-[885px] max-w-[1300px] mx-auto p-3 flex justify-between">
            <SideBar />
            <div className="max-w-[1050px] w-full">
                <Routes>
                    <Route path="/OrderHistory" element={undefined} />
                    <Route path="/CurrentOrder" element={<CurrentOrder />} />
                </Routes>
            </div>
        </div>
    )
}   
export default RiderDashboard