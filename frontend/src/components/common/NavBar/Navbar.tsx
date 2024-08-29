import { Link } from "react-router-dom"
import Profile from "./Profile"
import { useAuthContext } from "../../../context/AuthContext"

const Navbar = () => {
    const { user } = useAuthContext()

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

                <div>
                    {/* supposed to be profile */}
                    {user && <Profile />}
                </div>
            </div>
        </div>
    )
}

export default Navbar