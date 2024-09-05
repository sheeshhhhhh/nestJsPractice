import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../../ui/dialog"
import { Button } from "../../../../ui/button"
import MenuForm from "./MenuForm"
  

const AddMenu = () => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Menu Item
                    </DialogTitle>
                </DialogHeader>
                <MenuForm 
                type="add"
                setOpen={setOpen} />
            </DialogContent>
        </Dialog>
    )
}

export default AddMenu