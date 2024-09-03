import { PropsWithChildren } from 'react'
import { Link, Navigate, NavLink, useLocation } from 'react-router-dom'



const RestaurantNavigation = () => {
    const location = useLocation()

    if(location.pathname === '/Dashboard') {
        return <Navigate to={'dashboard'} />
    }

    return (
        <div className='flex flex-col gap-1 items-start max-w-[300px] mt-5 sticky top-0'>
            <Link 
            className='text-4xl font-bold mb-9'
            to={'dashboard'}>
                Dashboard
            </Link>
            <NavLinkComponent link='settings' >
                Settings
            </NavLinkComponent>
            <NavLinkComponent link='orderhistory'>
                Order History
            </NavLinkComponent>
            <NavLinkComponent link='category'>
                Categories
            </NavLinkComponent>
            <NavLinkComponent link='menu'>
                Menu's
            </NavLinkComponent>
        </div>
    )
}

type NavLinkProps = {
    link: string,
    className?: string,
} & PropsWithChildren

const NavLinkComponent = ({
    children,
    link,
    className
}: NavLinkProps) => {

    return (
        <NavLink 
        className={({ isActive}: any) => 
        `w-[200px] h-[40px] flex pl-3 items-center text-xl font-bold rounded-lg
        ${isActive  ? "bg-[#ececec]" : "hover:bg-muted"} ${className}`
        }
        to={link}>
            {children}
        </NavLink>
    )
}

export default RestaurantNavigation