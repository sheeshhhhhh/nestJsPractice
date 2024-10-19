import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './Pages/Home'
import Navbar from './components/common/NavBar/Navbar'
import GoogleAuth from './Pages/Google-Auth'
import CreateRestaurant from './Pages/CreateRestaurant'
import RestaurantDashboard from './Pages/RestaurantDashboard'
import PrivateRouteComponent from './components/common/PrivateRouteComponent'
import RestrictedAccess from './Pages/RestrictedAccess'
import UpdateRestaurant from './Pages/UpdateRestaurant'
import Restaurant from './Pages/Restaurant'
import Menu from './Pages/Menu'
import EditCartItem from './Pages/EditCartItem'
import PaymentSuccessful from './Pages/PaymentSuccessful'
import Order from './Pages/Order'
import OrderDetails from './Pages/OrderDetails'
import SetLocation from './Pages/SetLocation'
import RiderDashboard from './Pages/Rider/RiderDashboard'
import Message from './Pages/Message'

function App() {
  const location = useLocation()
  const { user, loading } = useAuthContext()

  const loginLink = `/login?next=${location.pathname}`
  // const isBusinessRole = user && user?.role === 'Business'
  if(loading) {
    return null
  }

  // if(isBusinessRole) {
  //   // pathname is important so that it will not loop to refreshing the page
  //   // take him to page setup
  //   if(location.pathname !== '/Dashboard' && user?.restaurant) {
  //     return window.location.assign(import.meta.env.VITE_client_BASE_URL + "/Dashboard")
  //   }

  //   if(location.pathname !== '/createRestaurant' && user?.restaurant === null) {
  //     return window.location.assign(import.meta.env.VITE_client_BASE_URL+ "/createRestaurant")
  //   }
  // }

  
  return (
    <div>
      <Navbar />
      <Routes>
        {/* this is for user */}
        <Route path="*" element={<h2>Not Found</h2>} />
        <Route path='/restrictedAccess' element={<RestrictedAccess />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to={`/`} />} />
        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to={`/`} />} />
        <Route path='/google-auth' element={<GoogleAuth />} />
        <Route path='/setLocation' element={<SetLocation />} />

        <Route path='/' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <Home />
          </PrivateRouteComponent>
        } />

        <Route path='/restaurant/:id' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <Restaurant />
          </PrivateRouteComponent>
        } />

        <Route path='/menu/:id' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <Menu />
          </PrivateRouteComponent>
        } />

        <Route path='/paymentSuccessful' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <PaymentSuccessful />
          </PrivateRouteComponent>
        } />

        <Route path='/order/:orderId' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <Order />
          </PrivateRouteComponent>
        } />

        <Route path='/orderMessage/:orderId' element={
          <PrivateRouteComponent role={['Customer', 'Rider']} userRole={user?.role} redirectTo={loginLink} >
            <Message />
          </PrivateRouteComponent>
        }
        />
        <Route path='/editCart/:cartItemId' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            <EditCartItem />
          </PrivateRouteComponent>
        } />

        <Route path='/setting' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            {undefined}
          </PrivateRouteComponent>
        } />

        <Route path='/orderHistory' element={
          <PrivateRouteComponent role={['Customer']} userRole={user?.role} redirectTo={loginLink} >
            {undefined}
          </PrivateRouteComponent>
        } />

        {/* for restaurant owners */} 
        <Route path='/createRestaurant' element={
          <PrivateRouteComponent role={['Business']} userRole={user?.role} >
            <CreateRestaurant />
          </PrivateRouteComponent>
        }/> 
        <Route path='/Dashboard/*' element={
          <PrivateRouteComponent role={['Business']} userRole={user?.role} >
            <RestaurantDashboard />
          </PrivateRouteComponent>
        } />
        <Route path='/updateRestaurant' element={
          <PrivateRouteComponent role={['Business']} userRole={user?.role} >
           <UpdateRestaurant />
          </PrivateRouteComponent>
        } />
        <Route path='/orderDetail/:orderId' element={
          <PrivateRouteComponent role={['Business']} userRole={user?.role} >
            <OrderDetails />
          </PrivateRouteComponent>
        } />

        {/* for Riders */}
        <Route path='/Rider/*' element={
          <PrivateRouteComponent role={['Rider']} userRole={user?.role}>
            <RiderDashboard />
          </PrivateRouteComponent>
        } />
      </Routes>
    </div>
  )
}

export default App
