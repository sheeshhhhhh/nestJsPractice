import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocalStorage } from '../util/localStorage'
import LoadingSpinner from '../components/common/LoadingSpinner'

// this is build just for handling the token and redirect instantly
const GoogleAuth = () => {
    const [searchParams] = useSearchParams()
    const { setItem } = useLocalStorage<string>('access_token')

    useEffect(() => {

            const token = searchParams.get('token')
            if(token) {
                setItem(token)
                window.location.assign('http://localhost:5173')
            }
    }, [])

    return (
        <div className='mt-5'>
            <LoadingSpinner className='h-8 w-8' />
        </div>
    )
}

export default GoogleAuth