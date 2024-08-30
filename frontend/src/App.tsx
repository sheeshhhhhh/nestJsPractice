import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './Pages/Home'
import Navbar from './components/common/NavBar/Navbar'
import GoogleAuth from './Pages/Google-Auth'
import CreateRestaurant from './Pages/CreateRestaurant'


function App() {
  const location = useLocation()
  const { user, loading } = useAuthContext()

  const loginLink = `/login?next=${location.pathname}`

  if(loading) {
    return null
  }

  // pathname is important so that it will not loop to refreshing the page
  if(user?.restaurant === null && location.pathname !== '/createRestaurant') {
    // take him to page setup
    return window.location.assign(import.meta.env.VITE_client_BASE_URL+ "/createRestaurant")
  }

  // implent check out page if not done with a modal 
  // and also make sure to have global state variable
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/login' element={!user ? <Login /> : <Navigate to={`/`} />} />
        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to={`/`} />} />
        <Route path='/' element={user ? <Home /> : <Navigate to={`/login?next=${location.pathname}`} />} />
        <Route path='/restaurant/:id' element={user ? undefined : <Navigate to={loginLink} />} />
        <Route path='/menu/:id' element={user ? undefined : <Navigate to={loginLink} />} />
        <Route path='/setting' element={user ? undefined : <Navigate to={loginLink} />} />
        <Route path='/orderHistory' element={user ? undefined : <Navigate to={loginLink} />} />
        <Route path='/google-auth' element={<GoogleAuth />} />

        <Route path='/createRestaurant' element={user ? <CreateRestaurant /> : <Navigate to={loginLink} />} />
      </Routes>
    </div>
  )
}

export default App
