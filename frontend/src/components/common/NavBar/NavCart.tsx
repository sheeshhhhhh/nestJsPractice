import { memo, useMemo, useState } from "react"
import { useCartContext } from "../../../context/CartContext"
import { Button } from "../../ui/button"
import { PhilippinePeso } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog"
import CartQuantity from "../Cart/CartQuantity"
import { Link } from "react-router-dom"

const NavCart = () => {
    const [open, setOpen] = useState<boolean>(false)
    const { loading, cart } = useCartContext()

    const price = useMemo(() => {
        let totalPrice = cart?.cartItems.reduce(
            (total, currValue) => total + (currValue.price * currValue.quantity), 0)
        return totalPrice
    }, [cart?.cartItems])

    if(loading || cart?.cartItems.length === 0) return null

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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Cart
                    </DialogTitle>
                    <DialogTitle className="text-sm font-normal">
                        {cart?.restaurant?.name}
                    </DialogTitle>
                </DialogHeader>
                <div className='flex flex-col gap-2 p-2'>
                    {cart?.cartItems?.map((menuItem) => {

                        return (
                            <div
                            className="flex items-center gap-3">
                                <CartQuantity cartItemId={menuItem.id} quantity={menuItem.quantity} />
                                <Link 
                                to={`/editCart/${menuItem.id}`}
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3"
                                >
                                    <div>
                                    <img 
                                    className="max-w-[80px] max-h-[80px] rounded-lg"
                                    width={80}
                                    src={menuItem.menu.HeaderPhoto} 
                                    />
                                    </div>
                                    <div className="max-w-[230px] w-full h-full">
                                        <h2 className="font-medium">
                                            {menuItem.menu.name}
                                        </h2>
                                        <p className="text-muted-foreground">
                                            {menuItem.menu.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center font-medium">
                                        <PhilippinePeso size={16} />
                                        {menuItem.price * menuItem.quantity}
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <div className="flex justify-between">
                        <h2 className="font-bold text-lg">
                            Subtotal
                        </h2>
                        <h2 className="font-bold text-lg flex items-center gap-1">
                            <PhilippinePeso size={16} />
                            {price}
                        </h2>
                    </div>
                    <div className="flex justify-between">
                        <h2 className="text-lg">
                            Standard delivery
                        </h2>
                        <h2 className="text-lg flex items-center gap-1">
                            {/* supposed to be delivery fee */}
                            <PhilippinePeso size={16} />
                            49
                        </h2>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default memo(NavCart)