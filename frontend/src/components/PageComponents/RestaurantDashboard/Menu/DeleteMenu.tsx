import { useState } from "react"
import { Button } from "../../../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { DropdownMenuItem } from "../../../ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import apiErrorHandler from "../../../../util/apiErrorHandler"
import { MenuInfo } from "../../../../types/menu.types"

type DeleteMenuProps = {
    menuId: string
}

const DeleteMenu = ({
    menuId
}: DeleteMenuProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const queryClient = useQueryClient()

    const { mutate: deleteMenu, isPending } = useMutation({
        mutationKey: ['deleteItem'],
        mutationFn: async () => {
            const response = await  apiClient.delete(`/menu/${menuId}`, {
                validateStatus: () => true
            })
            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ message, error, status:response.status })
            }
            return response.data
        },
        onSuccess: async (data) => {
            
            await queryClient.setQueryData(['menus'], (oldData: MenuInfo[]) => {
                console.log(data.deletedId)
                return [
                    ...oldData.filter((menu) => menu.id !== data.deletedId)
                ]
            })
            setOpen(false)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                className="w-full justify-start p-0"
                variant={'ghost'}
                onClick={() => setOpen(true)}
                >   
                    <DropdownMenuItem
                    className="text-red-500"
                    onSelect={e => e.preventDefault()}
                    >
                        Delete
                    </DropdownMenuItem>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-red-500">
                        Delete
                    </DialogTitle>
                    <DialogDescription>
                        Deleting this would be a permanent and you can never retreive it.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-around">
                    <Button 
                    onClick={() => setOpen(false)}
                    className="w-[150px]"
                    variant={'outline'}>
                        Cancel
                    </Button>
                    <Button
                    onClick={() => deleteMenu()}
                    disabled={isPending}
                    className="w-[150px]"
                    variant={'destructive'}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteMenu