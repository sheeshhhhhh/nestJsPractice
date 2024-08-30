import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Form from '../components/PageComponents/CreateRestaurant/Form'

const CreateRestaurant = () => {
    const { user } = useAuthContext()
    // if user already has a restaurant 
    if(user?.restaurant?.id) return <Navigate to={'/restaurantDashboard'} />

    return (
        <div>
            <Form />
        </div>
    )
}

export default CreateRestaurant