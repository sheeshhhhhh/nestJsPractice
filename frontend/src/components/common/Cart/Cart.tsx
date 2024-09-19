import {  DialogFooter } from '../../ui/dialog'
import { Button } from '../../ui/button'
import { PhilippinePeso } from 'lucide-react'
import CartQuantity from './CartQuantity'
import CartCard from './CartCard'
import { useCartContext } from '../../../context/CartContext'
import { Dispatch, SetStateAction } from 'react'
import { StageStatus } from '../NavBar/NavCart'

type CartProps = {
    price: number | undefined,
    setOpen: Dispatch<SetStateAction<boolean>>, // for dialog state
    setStage: Dispatch<SetStateAction<StageStatus>>, // set's the stage of whether checkout or cart
}

const Cart = ({
    price,
    setOpen,
    setStage
}: CartProps) => {
    
    const { cart } = useCartContext()
        
    return (            
        <div>
            <div className='flex flex-col gap-2 p-2'>
                {cart?.cartItems?.map((menuItem) => {
                    return (
                        <div
                        className="flex items-center gap-3">
                            <CartQuantity cartItemId={menuItem.id} quantity={menuItem.quantity} />
                            <CartCard setOpen={setOpen} cartItem={menuItem} />
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
            <DialogFooter className="sm:justify-center mt-2">
                <Button
                onClick={() => setStage('CheckOut')}
                className="w-[300px] h-[45px]"
                >
                    Review Your payment
                </Button>
            </DialogFooter>
        </div>
    )
}

export default Cart