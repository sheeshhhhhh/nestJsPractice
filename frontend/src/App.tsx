import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './Pages/Home'
import Navbar from './components/common/NavBar/Navbar'
import GoogleAuth from './Pages/Google-Auth'


function App() {
  const location = useLocation()
  const { user, loading } = useAuthContext()

  if(loading) {
    return null
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
        <Route path='restaurant/:id' element={user ? undefined : <Navigate to={`/login?next=${location.pathname}`} />} />
        <Route path='menu/:id' element={user ? undefined : <Navigate to={`/login?next=${location.pathname}`} />} />
        <Route path='setting' element={user ? undefined : <Navigate to={`/login?next=${location.pathname}`} />} />
        <Route path='orderHistory' element={user ? undefined : <Navigate to={`/login?next=${location.pathname}`} />} />
        <Route path='google-auth' element={<GoogleAuth />} />
      </Routes>
    </div>
  )
}

export default App
