import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import Form from '../components/PageComponents/CreateRestaurant/Form'

const CreateRestaurant = () => {
    const { user } = useAuthContext()
    // if user already has a restaurant then redirect 
    if(user?.restaurant?.id) return <Navigate to={'/Dashboard'} />

    const redirect = () => {
        return <Navigate to={'/Dashboard'} />
    }

    return (
        <div>
            <Form callBackFunction={redirect} />
        </div>
    )
}

export default CreateRestaurant