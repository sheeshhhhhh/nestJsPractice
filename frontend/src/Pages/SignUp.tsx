import { ChangeEvent, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { Laptop2Icon } from "lucide-react"
import { BriefcaseIcon } from "lucide-react"
import axios from 'axios'
import PickARole from "../components/PageComponents/SignUp/PickARole"

type signupInfoType = {
    username: string,
    confirmPassword: string,
    password: string
}
// normal user signUp
const SignUp = () => {
    const [stages, setStages] = useState(0)
    const [role, setRole] = useState<'Business' | 'Customer'>()
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
                password: signupInfo.password,
                role: role
            })
            
            if(data.data === "successfully created User") {
                return window.location.assign('http://localhost:5173/login')
            }
        }
    })

    return (
        <div className="min-h-screen w-full flex justify-center pt-[200px]">
            {stages === 0 && 
                <PickARole role={role} setRole={setRole} setStage={setStages} />
            }
            {stages === 1 && <div>
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
            </div>}
        </div>
    )
}

export default SignUp