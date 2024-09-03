import RestaurantNavigation from '../components/PageComponents/RestaurantDashboard/Navigation'
import { Separator } from '../components/ui/separator'
import { useAuthContext } from '../context/AuthContext'
import { Navigate, Route, Routes } from 'react-router-dom'
import Category from './RestaurantDashBoard/Category'
import Dashboard from './RestaurantDashBoard/Dashboard'
import Menu from './RestaurantDashBoard/Menu'
import Settings from './RestaurantDashBoard/Settings'
import OrderHistory from './RestaurantDashBoard/OrderHistory'

const RestaurantDashboard = () => {
    const { user } = useAuthContext()
    if(!user?.restaurant?.id) return <Navigate to={'/createRestaurant'} />

    return (
        <div className='min-h-[884px] max-w-[1400px] w-full h-auto p-8 flex mx-auto relative'>
            <RestaurantNavigation />
            <Separator orientation='vertical' className='w-[2px] h-[684px] mx-5' />
            <div className='w-full h-auto'>
                <Routes>
                    <Route path={'dashboard'}       element={<Dashboard />} />
                    <Route path={'settings'}        element={<Settings />} />
                    <Route path={'Orderhistory'}    element={<OrderHistory />} />
                    <Route path={'category'}        element={<Category />}/>
                    <Route path={'menu'}            element={<Menu />}/>
                </Routes>
            </div>
        </div>
    )
}

export default RestaurantDashboard