import { memo, useMemo, useState } from "react"
import { useCartContext } from "../../../context/CartContext"
import { Button } from "../../ui/button"
import { ArrowLeftIcon, PhilippinePeso } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import LoadingSpinner from "../LoadingSpinner"
import Cart from "../Cart/Cart"
import CheckOut from "../Checkout/CheckOut"

export type StageStatus = "Cart" | "CheckOut"

const NavCart = () => {
    const [open, setOpen] = useState<boolean>(false)
    const [stage, setStage] = useState<StageStatus>("Cart")
    
    // calculating thep rice
    const { loading, cart } = useCartContext()
    const price = useMemo(() => {
        let totalPrice = cart?.cartItems.reduce(
            (total, currValue) => total + (currValue.price * currValue.quantity), 0)
        return totalPrice
    }, [cart?.cartItems])

    if(loading) return (
        <div className="w-[230px]">
            <LoadingSpinner className="mx-auto w-7 h-7" />
        </div>
    )

    if(!open) {
        // always making sure to bring the user to cart if it closes
        // not in the checkout because he might change the cart
        stage === 'CheckOut' && setStage('Cart') 
    }
        
    if(!cart || price === 0 || !price) {
        open && setOpen(false)
        return null
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                <Button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 w-full max-w-[230px] px-5"
                >
                    <div className="size-[25px] rounded-full border flex justify-center items-center">
                        {cart?.cartItems?.length}
                    </div>
                    View your cart
                    <div className="flex items-center">
                        <PhilippinePeso size={14} />
                        {price}
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[820px] pb-0 overflow-y-auto scrollbar-hide">
                <DialogHeader className="flex-row items-end gap-2">
                    <Button
                    onClick={() => setStage(prev => prev === 'CheckOut' ? 'Cart' : 'Cart')}
                    variant={'ghost'}
                    className="mb-[2px]"
                    >
                        <ArrowLeftIcon className="font-bold" />
                    </Button>
                    <div>
                        <DialogTitle className="text-2xl">
                            Cart
                        </DialogTitle>
                        <DialogTitle className="text-sm font-normal">
                            {cart?.restaurant?.name}
                        </DialogTitle>
                    </div>
                </DialogHeader>
                {stage === 'Cart' && <Cart setOpen={setOpen} price={price} setStage={setStage} />}
                {stage === 'CheckOut' && <CheckOut price={price} setStage={setStage} />}
            </DialogContent> 
        </Dialog>
    )
}

export default memo(NavCart)