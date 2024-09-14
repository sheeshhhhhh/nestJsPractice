import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { useLocalStorage } from "../util/localStorage"

type loginInput = {
    username: string,
    password: string
}

const Login = () => {
    const [loginInput, setLoginInput] = useState<loginInput>({
        username: '',
        password: ''
    })
    const [searchParams, setSearchParams] = useSearchParams()
    const { setItem } = useLocalStorage<string>('access_token')
    const next = searchParams.get('next')

    const { mutate: login, isPending } = useMutation({
        mutationFn: async () => {
            const res = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(loginInput),
                credentials: 'include'
            })
            const data = await res.json()

            if(data.error) throw new Error(data.error)
            if(data.access_token) {
                setItem(data.access_token)
                next ? 
                window.location.assign(`http://localhost:5173${next}`) :
                window.location.assign(`http://localhost:5173`)
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

                    <Link to={'http://localhost:3000/auth/google-login'}>
                        <Button 
                        className="w-[200px]"
                        variant={'outline'} >
                            Google
                        </Button>
                    </Link>

                </CardFooter>
            </Card>

        </div>
    )
}

export default Login