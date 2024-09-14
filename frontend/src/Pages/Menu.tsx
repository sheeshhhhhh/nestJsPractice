import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import apiClient from "../util/apiClient"
import LoadingSpinner from "../components/common/LoadingSpinner"
import apiErrorHandler from "../util/apiErrorHandler"
import { MenuInfo } from "../types/menu.types"
import { Card, CardContent, CardDescription, CardHeader } from "../components/ui/card"
import { PhilippinePesoIcon, ChevronRightIcon } from "lucide-react"
import { Separator } from "../components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"
import { Button } from "../components/ui/button"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Label } from "../components/ui/label"

const Menu = () => {

    const { id } = useParams()
    const { isLoading, data: Menu } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const response = await apiClient.get(`/menu/${id}`)

            if(response.status >= 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, status: response.status, message })
            }
            return response.data as MenuInfo
        }
    })

    if(isLoading) return <LoadingSpinner />

    if(!Menu) {
        // should redirect to error url
        return <h2>Error</h2>
    }    

    return (
        <Card className="w-full max-w-[800px] mx-auto">
            <CardHeader>
                <div aria-label="HeaderPhoto" className="bg-white flex justify-center">
                    <img 
                    src={Menu.HeaderPhoto}
                    className="w-full h-full max-w-[600px] max-h-[400px]"
                    />
                </div>
                <div className="flex items-center justify-between py-4">
                    <h2 className="font-bold text-4xl">
                        {Menu.name}
                    </h2>
                    <div className="flex items-center gap-1 font-bold mr-5">
                        <h2 className="text-xl">
                            from 
                        </h2>
                        <PhilippinePesoIcon size={20}  />
                        <h2 className="text-xl">
                            {Menu.price}
                        </h2>
                    </div>
                </div>
                {Menu.description && 
                    <div>
                        <CardDescription>
                            {Menu.description}
                        </CardDescription>
                    </div>
                }
            </CardHeader>
            <div className="flex justify-center">
                <Separator className="max-w-[720px] h-[2px]" />
            </div>
            <CardContent>
                {/* put options here later */}
            
                {/* <div className="flex justify-center">
                    <Separator className="max-w-[720px] h-[2px]" />
                </div> */}
                <div className="p-2">
                    <h2 className="font-bold text-xl py-1">
                        Special instructions
                    </h2>
                    <CardDescription>
                        Please let us know if you are allergic to anything or if we need 
                        avoid anything
                    </CardDescription>
                    <div className="relative">
                        <textarea 
                        className="my-3 w-full h-[90px] border-2 border-black rounded-lg p-2"
                        />
                        <h2 className="absolute top-0 left-3 bg-white font-bold px-2">
                            Instruction
                        </h2>
                    </div>
                </div>
                <div className="p-2">
                    <h2 className="font-bold text-xl py-2">
                        If this product is not available
                    </h2>
                    <Sheet >
                        <SheetTrigger asChild>
                            <Button 
                            variant={'outline'} 
                            className="p-6 text-lg flex justify-between max-w-[500px] w-full border-2">
                                Remove it from my order 
                                <ChevronRightIcon />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side={'bottom'} className="w-[600px] mx-auto rounded-t-lg">
                            <SheetHeader>
                                <SheetTitle>
                                    If this product is not available
                                </SheetTitle>
                            </SheetHeader>
                            <div className="p-3">
                                <RadioGroup onValueChange={(value) => console.log(value)}>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="Remove it from my order" id="option-1"/>
                                        <Label htmlFor="option-1">Remove it from my order</Label>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <RadioGroupItem value="Call me" id="option-1"/>
                                        <Label htmlFor="option-1">Call me</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </CardContent>
        </Card>
    )
}

export default Menu