import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import apiClient from "../../../util/apiClient"
import { useLocalStorage } from "../../../util/localStorage"
import toast from "react-hot-toast"

type signupInfoType = {
    username: string,
    confirmPassword: string,
    password: string
}

type SignupUserProps = {
    role: 'Business' | 'Customer' | undefined
}

const SignupUser = ({
    role
}: SignupUserProps) => {
    const [signupInfo, setSignupInfo] = useState<signupInfoType>({
        username: '',
        confirmPassword: '',
        password: ''
    })
    const { setItem } = useLocalStorage<string>('access_token')
    const changeEvent = (name: string, e: ChangeEvent<HTMLInputElement>) => {
        setSignupInfo(prev => ({
            ...prev,
            [name]: e.target.value
        }))
    }

    const { mutate: signUp, isPending, error } = useMutation({
        mutationFn: async () => {
            if(signupInfo.password !== signupInfo.confirmPassword) return 

            const response = await apiClient.post('/auth/signUp', {
                username: signupInfo.username,
                name: signupInfo.username,
                password: signupInfo.password,
                role: role
            }, {
                validateStatus: () => true // Allow only 2xx and 4xx responses
            })
            if(response.status === 501) {
                throw new Error(response.data.message);
            }

            if(response.status === 500) {
                throw new Error("Internal server error")
            }

            if(response.data.access_token) {
                setItem(response.data.access_token);
                return window.location.assign('http://localhost:5173');
            }
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const usernameError = error?.message === 'username already exist' // for hanling username unique constraints

    return (
        <Card className="w-[400px]">
            <CardHeader>
                <CardTitle className="font-bold text-3xl">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
                <Input 
                className={`mt-3 ${usernameError && 'focus-visible:ring-red-500 border-red-500'}`}
                placeholder="username"
                type="text"
                value={signupInfo.username}
                onChange={(e) => changeEvent('username', e)}
                />
                {usernameError && 
                    <h2 className="text-red-500" >
                        {error.message}
                    </h2>
                }
                <Input 
                className="mt-3"
                placeholder="password"
                type="password"
                value={signupInfo.password}
                onChange={(e) => changeEvent('password', e)}
                />
                <Input 
                className="mt-3"
                placeholder="confirmPassword"
                type="password"
                value={signupInfo.confirmPassword}
                onChange={(e) => changeEvent('confirmPassword', e)}
                />
            </CardContent>
            <CardFooter>
                <Button
                onClick={() => signUp()}
                disabled={isPending}
                >
                    Sign Up
                </Button>
            </CardFooter>
        </Card>
    )
}

export default SignupUser