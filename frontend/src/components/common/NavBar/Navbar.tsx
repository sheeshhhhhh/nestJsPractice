import { Link } from "react-router-dom"
import { UserIcon } from 'lucide-react'

const Navbar = () => {
    

    return (
        <div className="mt-0 h-[60px] border mb-2 p-2">
            <div className="h-[42px] max-w-7xl w-full flex items-center justify-between mx-auto">
                <div>
                    <Link 
                    className="font-bold text-3xl"
                    to={'/'}>
                        Recipe Verse
                    </Link>
                </div>

                <nav>
                    {/* supposed to be links */}
                </nav>

                <div>
                    {/* supposed to be profile */}
                    <div className="size-[42px] flex justify-center items-center border border-1 rounded-full">
                        <UserIcon size={30} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar