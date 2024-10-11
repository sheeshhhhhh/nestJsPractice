import { createContext, useContext, useEffect, useState } from "react";
import { PropsWithChildren } from "react";
import apiClient from "../util/apiClient";
import { useLocalStorage } from "../util/localStorage";
import { useNavigate } from "react-router-dom";

type UserInfo = {
    profile?: string,
    email?: string,
    address?: string,
    latitude: number,
    longitude: number
}

// use confitional type to check if user is rider or restaurant later
type User = {
    id: string
    name: string,
    username: string,
    oauthId?: string,
    restaurant?: {
        id?: string
    },
    rider?: {
        id?: string
    }
    role: string,
    userInfo: UserInfo
}

type ContextValue = {
    user: User | undefined,
    loading: boolean
}

const authContextInitialValue = {
    user: undefined,
    loading: true
}

const authContext = createContext<ContextValue>(authContextInitialValue)

export const useAuthContext = () => {
    const Context = useContext(authContext)
    return Context
}

export const AuthContextProvider = ({ children } : PropsWithChildren) => {
    const [user, setUser] = useState<User | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const { removeItem } = useLocalStorage<string>('access_token')
    const navigate = useNavigate()

    useEffect(() => {
        const getUser = async () => {
            setLoading(true)
            try {
                const response = await apiClient.get('/auth/check')

                if(response.status === 401) {
                    removeItem()
                } else if (response.status === 406) {
                    return navigate(`/setLocation`)
                } 
                
                if(response) {
                    // verify role
                    setUser(response.data)
                }
                
            } catch (error: any) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }
        getUser()
    }, [])

    const value = {
        user: user,
        loading: loading
    }

    return (
        <authContext.Provider value={value}>
            {children}
        </authContext.Provider>
    )
}