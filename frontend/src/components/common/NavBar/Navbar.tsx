import { Link } from "react-router-dom"
import Profile from "./Profile"
import { useAuthContext } from "../../../context/AuthContext"
import NavCart from "./NavCart"
import { useOrderContext } from "../../../context/OrderContext"
import Order from "../Order/Order"

const Navbar = () => {
    const { user } = useAuthContext()
    const { order, loading } = useOrderContext()

    return (
        <div className="mt-0 h-[60px] border mb-2 p-2">
            <div className="h-[42px] max-w-7xl w-full flex items-center justify-between mx-auto">
                <div>
                    <Link 
                    className="font-bold text-3xl"
                    to={'/'}>
                       Title Company
                    </Link>
                </div>

                <nav>
                    {/* supposed to be links */}
                </nav>  

                <div className="flex gap-5 items-center">
                    {
                        (user && user.role === 'Customer') && // if there is user and user is customer
                        (order || loading) ? // if order exist
                        <Order />
                        :
                        <NavCart />
                    }
                    {/* supposed to be profile */}
                    {user && <Profile />}
                </div>
            </div>
        </div>
    )
}

export default Navbar