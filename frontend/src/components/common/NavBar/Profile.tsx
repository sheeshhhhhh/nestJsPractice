import { UserIcon } from "lucide-react"
import { useAuthContext } from "../../../context/AuthContext"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../../ui/sheet"
import { Button } from "../../ui/button"
import { LogOutIcon } from "lucide-react"
import { useLocation } from "react-router-dom"
  
// this also contains the routing of the navigation for the user
const Profile = () => {
    const { user } = useAuthContext()
    const location = useLocation()

    return (
        <Sheet>
            <SheetTrigger>
                <div className="size-[42px] flex justify-center items-center border border-1 rounded-full">
                    {
                        user?.userInfo?.profile ? 
                        <img 
                        className="size-[42px] rounded-full" 
                        src={user.userInfo.profile} 
                        /> :
                        <UserIcon size={30} />
                    }
                </div>
            </SheetTrigger>
            <SheetContent
            className="max-w-[300px] w-[300px]"
            >
                <SheetHeader>
                    <SheetTitle>
                        {user?.name}
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-12 flex flex-col">
                    
                    <Button 
                    onClick={() => {
                        localStorage.removeItem('access_token')
                        window.location.assign(`${import.meta.env.VITE_client_BASE_URL}/login?next=${location.pathname}`)
                    }}
                    variant={'ghost'} 
                    className="flex justify-start items-center"
                    >
                        <LogOutIcon className="mr-4" />
                    
                        <h2 className="font-bold text-base">Log out</h2>
                    </Button>

                </div>
            </SheetContent>
        </Sheet>
    )
}

export default Profile