import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"

type PrivateReouteComponentProps = {
    role: string[],
    userRole: string | undefined,
    redirectTo?: string
} & PropsWithChildren

const PrivateRouteComponent = ({ children, role, userRole, redirectTo}: PrivateReouteComponentProps) => {
    if(!userRole) return <Navigate to={'/login'} />
    
    if(!role.includes(userRole)) {
        if(userRole === 'Business') { 
            return <Navigate to={'/Dashboard'} />
        } else if(redirectTo) {
            return <Navigate to={redirectTo} />
        } else {
            return <Navigate to={'/restrictedAccess'} />
        }
    }
  
    return children
}

export default PrivateRouteComponent