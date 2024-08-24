import { ChangeEvent, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useMutation } from "@tanstack/react-query"
import axios from 'axios'

type signupInfoType = {
    username: string,
    confirmPassword: string,
    password: string
}

const SignUp = () => {
    const [signupInfo, setSignupInfo] = useState<signupInfoType>({
        username: '',
        confirmPassword: '',
        password: ''
    })

    const changeEvent = (name: string, e: ChangeEvent<HTMLInputElement>) => {
        setSignupInfo(prev => ({
            ...prev,
            [name]: e.target.value
        }))
    }

    const { mutate: signUp, isPending } = useMutation({
        mutationFn: async () => {
            if(signupInfo.password !== signupInfo.confirmPassword) return 

            const data = await axios.post('http://localhost:3000/auth/signUp', {
                username: signupInfo.username,
                name: signupInfo.username,
                password: signupInfo.password
            })
            console.log(data)
            if(data.data === "successfully created User") {
                return window.location.assign('http://localhost:5173/login')
            }
        }
    })

    return (
        <div className="min-h-screen w-full flex justify-center pt-[300px]">
            <div>
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle className="font-bold text-3xl">Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input 
                        className="mt-3"
                        placeholder="username"
                        type="text"
                        value={signupInfo.username}
                        onChange={(e) => changeEvent('username', e)}
                        />

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
            </div>
        </div>
    )
}

export default SignUp