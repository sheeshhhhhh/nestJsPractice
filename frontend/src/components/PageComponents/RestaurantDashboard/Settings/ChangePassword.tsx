import { ChangeEvent, useState } from "react"
import { Button } from "../../../ui/button"
import { Card, CardContent, CardTitle, CardDescription, CardHeader, CardFooter } from "../../../ui/card"
import { Input } from "../../../ui/input"
import { useMutation } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import LoadingSpinner from "../../../common/LoadingSpinner"
import { Label } from "../../../ui/label"
import toast from "react-hot-toast"
import apiErrorHandler from "../../../../util/apiErrorHandler"

type passwordInfoType = {
    password: string,
    newPassword: string,
    confirmPassword: string    
}

const ChangePassword = () => {
    const [passwordInfo, setPasswordInfo] = useState<passwordInfoType>({
        password: '',
        newPassword: '',
        confirmPassword: ''
    })

    const changeEvent = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        if(!(name in passwordInfo)) {
            throw new Error("name does not exist in the object you provided")
        }
        setPasswordInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const { mutate: changePassword, isPending } = useMutation({
        mutationFn: async () => {
            const { data, status } = await apiClient.post('/user/change-Password', {
                ...passwordInfo
            }, {
                validateStatus: () => true
            })
            // handling error
            if(status >= 400) {
                const error = data.error
                const message = data.message
                return apiErrorHandler({ error, status, message })
            }
            // clearing the name after successfully changing password
            setPasswordInfo({
                password: '',
                newPassword: '',
                confirmPassword: ''
            })
            toast.success('successfully changed password')
        }
    })

    return (
        <Card className="max-w-[660px]">
            <CardHeader>
                <CardTitle>
                    Change Password
                </CardTitle>
                <CardDescription>
                    You can change your password everytime and also recover it through your email
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input  
                    type="password"
                    id="password"
                    name="password"
                    value={passwordInfo.password}
                    onChange={changeEvent}
                    />
                </div>
                <div>
                    <Label htmlFor="newPassword">new Password</Label>
                    <Input
                    type="password"
                    id="newPassword"  
                    name="newPassword"
                    value={passwordInfo.newPassword}
                    onChange={changeEvent}
                    />
                </div>
                <div>
                    <Label htmlFor="confirmPassword">confirm Password</Label>
                    <Input  
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordInfo.confirmPassword}
                    onChange={changeEvent}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button
                disabled={isPending}
                onClick={() => changePassword()}
                >
                    {isPending ? <LoadingSpinner /> : "Change Password"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ChangePassword