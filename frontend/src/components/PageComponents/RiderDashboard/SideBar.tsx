import { Link, NavLink } from "react-router-dom"

const riderUrls = [
    'OrderHistory',
    'CurrentOrder',
]

const SideBar = () => {
    
    
    return (
        <div className="w-full max-w-[200px]">
            <h2 className="font-bold text-2xl mb-3">
                Rider Dashboard
            </h2>
            <div className="flex flex-col gap-1 pl-2">
                {riderUrls.map((url) => {

                    return (
                        <NavLink 
                        className={({ isActive}) => {
                            return `${isActive && 'bg-muted'} p-2 rounded-md text-lg font-semibold hover:bg-muted`
                        }}
                        to={url}>
                                {url}
                        </NavLink>
                    )
                })}
            </div>
        </div>
    )
}

export default SideBar