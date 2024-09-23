import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { useLocalStorage } from "../util/localStorage"
import apiClient from "@/util/apiClient"

type loginInput = {
    username: string,
    password: string
}

const Login = () => {
    const [loginInput, setLoginInput] = useState<loginInput>({
        username: '',
        password: ''
    })
    const [searchParams] = useSearchParams()
    const { setItem } = useLocalStorage<string>('access_token')
    const next = searchParams.get('next')

    const { mutate: login, isPending } = useMutation({
        mutationFn: async () => {
            const response = await apiClient.post('auth/login',
                JSON.stringify(loginInput)
                ,
                {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
            })

            const data = response.data
            if(data.error) throw new Error(data.error)
            if(data.access_token) {
                setItem(data.access_token)
                next ? 
                window.location.assign(`${import.meta.env.VITE_client_BASE_URL}${next}`) :
                window.location.assign(`${import.meta.env.VITE_client_BASE_URL}`)
            }
        }
    })
    
    const changeEvent = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name} = e.target

        setLoginInput((prev ) => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="flex justify-center mt-[250px]">

            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle className="font-bold text-3xl">Login</CardTitle>
                </CardHeader>
                <CardContent >
                    <Input 
                    name="username"
                    value={loginInput.username}
                    onChange={changeEvent}
                    placeholder="username"
                    type="text" 
                    className="mt-3"
                    />
                    <Input 
                    name="password"
                    value={loginInput.password}
                    onChange={changeEvent}
                    placeholder="password"
                    type="text" 
                    className="mt-3"
                    />

                    <p className="mt-1">
                        Don't have an account? {" "}
                        <Link 
                        className="text-blue-700 underline-offset-2 hover:underline"
                        to={`${import.meta.env.VITE_client_BASE_URL}/signup`}>
                            Sign Up
                        </Link>
                    </p>
                </CardContent>
                <CardFooter className="space-x-7">
                    <Button
                    disabled={isPending}
                    onClick={() => login()}
                    >
                        Login
                    </Button>

                    <Button 
                    onClick={() => window.location.assign(`${import.meta.env.VITE_backendAPI_URL}/auth/google-login`)}
                    className="w-[200px]"
                    variant={'outline'} >
                        Google
                    </Button>

                </CardFooter>
            </Card>

        </div>
    )
}

export default Login