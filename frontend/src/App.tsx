import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { useAuthContext } from './context/AuthContext'
import Home from './Pages/Home'


function App() {
  const location = useLocation()
  const { user, loading } = useAuthContext()

  if(loading) {
    return null
  }

  return (
    <div>
      <Routes>
        <Route path='/login' element={!user ? <Login /> : <Navigate to={`/`} />} />
        <Route path='/signup' element={!user ? <SignUp /> : <Navigate to={`/`} />} />
        <Route path='/' element={user ? <Home /> : <Navigate to={`/login?next=${location.pathname}`} />} />
      </Routes>
    </div>
  )
}

export default App
