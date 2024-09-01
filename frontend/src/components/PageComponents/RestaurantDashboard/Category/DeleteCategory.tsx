import { useState } from "react"
import { Button } from "../../../ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "../../../ui/dialog"
import { DropdownMenuItem } from "../../../ui/dropdown-menu"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import { category } from "../../../../types/restaurant.types"

type DeleteCategoryProps = {
    categoryId: string
}

const DeleteCategory = ({
    categoryId
}: DeleteCategoryProps) => {
    const [modal, setModal] = useState<boolean>(false)
    const queryClient = useQueryClient()

    const handleSelect = (event: any) => { 
        event.preventDefault() // Prevents the dropdown menu from closing
        setModal(true)         // Opens the modal just in case
    }

    const { mutate: DeleteItem, isPending } = useMutation({
        mutationKey: ['deleteItem'],
        mutationFn: async () => {
            const response = await apiClient.delete(`/category/${categoryId}`)
            return response.data
        },
        onSuccess: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['categories'] })
            queryClient.setQueryData(['categories'], (oldCategories: category[] | []) => {
                return [
                    ...oldCategories.filter((category) => data.deletedId !== category.id)
                ]
            })
        }
    })

    return (
        <Dialog open={modal} onOpenChange={setModal}>
            <DialogTrigger asChild>
                <Button 
                className="w-full justify-start p-0"
                onClick={() => setModal(true)}
                variant={'ghost'}>
                    <DropdownMenuItem onSelect={handleSelect} >Delete</DropdownMenuItem>
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-red-500">
                        Delete Item
                    </DialogTitle>
                    <DialogDescription>
                        Warning: Deleting this category will delete the menus that is in 
                        this category
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-around mt-3">
                
                <Button 
                className="w-[140px]"
                onClick={() => setModal(false)}
                variant={"outline"}>
                    Cancel
                </Button>

                <Button
                onClick={() =>DeleteItem()}
                disabled={isPending}
                className="w-[140px]"
                variant={'destructive'}
                >
                    Delete
                </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCategory