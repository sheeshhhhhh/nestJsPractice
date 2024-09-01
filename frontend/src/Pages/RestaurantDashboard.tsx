import { useAuthContext } from '../context/AuthContext'
import { Navigate, Route, Routes } from 'react-router-dom'

const RestaurantDashboard = () => {
    const { user } = useAuthContext()
    if(!user?.restaurant?.id) return <Navigate to={'/createRestaurant'} />

    return (
        <div>

            <Routes>
                <Route path={'settings'} element={undefined} />
                <Route path={'Orderhistory'}  element={undefined} />
                <Route path={'category'} />
                <Route path={'menu'} />
            </Routes>
        </div>
    )
}

export default RestaurantDashboard