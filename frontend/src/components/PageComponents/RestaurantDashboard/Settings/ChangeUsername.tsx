import { useState } from "react"
import { Card, CardContent, CardDescription, CardTitle, CardHeader, CardFooter } from "../../../ui/card"
import { Input } from "../../../ui/input"
import { Label } from "../../../ui/label"
import { useMutation } from "@tanstack/react-query"
import { Button } from "../../../ui/button"
import apiClient from "../../../../util/apiClient"
import apiErrorHandler from "../../../../util/apiErrorHandler"
import LoadingSpinner from "../../../common/LoadingSpinner"
import { useAuthContext } from "../../../../context/AuthContext"


const ChangeUsername = () => {
    const { user } = useAuthContext()
    const [username, setUsername] = useState<string>(user?.username || '')
    const [error, setError] = useState<any>()

    const { mutate: changeUsername, isPending } = useMutation({
      mutationFn: async () => {
        const { data, status } = await apiClient.post('/user/change-Username', {
          username: username
        }, {
          validateStatus: () => true
        })

        if(status >= 400) {
          const error = data.error
          const message = data.message
          setError(message)
          return apiErrorHandler({ error, status, message})
        }
        // make sure to make authcontext usequery so that you can invalidate the user
        // query and update it
      }
    })
    
    return (
      <Card className="max-w-[660px]">
        <CardHeader>
          <CardTitle>
            Change Username
          </CardTitle>
          <CardDescription>
            Username is use for logging in <br/>
            You can change it anytime with no limits. but the usernames are limited 
            to what is available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="usernameInput">username</Label>
          <Input 
          id="usernameInput"
          className={`${error && "border-red-500 focus-visible:ring-red-500"}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
          {error && <p className="text-red-500 font-medium">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button
          disabled={isPending}
          onClick={() => changeUsername()}
          >
            {isPending ? <LoadingSpinner /> : "Change Username"}
          </Button>
        </CardFooter>
      </Card>
    )
}

export default ChangeUsername