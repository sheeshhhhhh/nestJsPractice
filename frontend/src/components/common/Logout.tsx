import { useLocation } from 'react-router-dom'
import { useLocalStorage } from '../../util/localStorage'
import { Button } from '../ui/button'

type LogoutRrops = {
    className?: string,
}

const Logout = ({
    className,
    ...props
} : LogoutRrops) => {
    const { removeItem } = useLocalStorage<string>('access_token')
    const location = useLocation()

    const logOut = () => {
        removeItem()
        window.location.assign('http://localhost:3000' + location.pathname)
    }

    return (
        <Button
        {...props}
        className={className}
        onClick={() => logOut()}
        >
            Logout
        </Button>
    )
}

export default Logout