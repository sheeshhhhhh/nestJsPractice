import { useEffect, useState } from "react"
import { Button } from "../../ui/button"
import { Card, CardContent } from "../../ui/card"
import { PlusIcon, MinusIcon } from "lucide-react"

type MenuOrderCountProps ={
    initialCount?: number,
    callBackFunction: (orderCount: number) => void,
    buttonText: string;
}

const MenuOrderCount = ({
    initialCount,
    callBackFunction,
    buttonText
}: MenuOrderCountProps) => {
    const [orderCount, setOrderCount] = useState<number>(initialCount || 1)

    useEffect(() => {
        if(initialCount) {
            setOrderCount(initialCount)
        } else {
            setOrderCount(1)
        }
    }, [initialCount])

    // should add warnign later on when ordering on a differenct restaurant
    return (
        <Card className="max-h-[150px] w-[280px]">
            <CardContent className="flex md:flex-col gap-3 p-4">
                <div className="flex gap-4 justify-center items-center">
                    <Button 
                    onClick={() => setOrderCount(prev => prev > 1 ? prev - 1 : 1)}
                    variant={'outline'} 
                    className="rounded-full w-[45px] h-[45px] p-0">
                        <MinusIcon size={30} />
                    </Button>
                    <h1 className="font-bold text-2xl">
                        {orderCount}
                    </h1>
                    <Button 
                    onClick={() => setOrderCount(prev => prev + 1)}
                    variant={'outline'}
                    className="rounded-full w-[45px] h-[45px] p-0">
                        <PlusIcon size={30}/>
                    </Button>
                </div>
                <Button
                onClick={() => callBackFunction(orderCount)}
                >
                    {buttonText}
                </Button>            
            </CardContent>
        </Card>
    )
}

export default MenuOrderCount