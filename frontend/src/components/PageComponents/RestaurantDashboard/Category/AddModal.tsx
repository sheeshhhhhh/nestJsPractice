import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { Input } from "../../../ui/input"
import { useAuthContext } from "../../../../context/AuthContext"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import { category } from "../../../../types/restaurant.types"
import toast from "react-hot-toast"
  
const AddModal = () => {
    const [modal, setModal] = useState<boolean>(false)
    const [categoryName, setCategoryName] = useState<string>('')
    const { user } = useAuthContext()
    const restaurantId = user?.restaurant?.id
    const queryClient = useQueryClient()

    const { mutate: addCategory, isPending } = useMutation({
        mutationKey: ['addCategory'],
        mutationFn: async () => {
            const response = await apiClient.post(`/category/${restaurantId}`, {
                CategoryName: categoryName
            }, { validateStatus: () => true})
            if(response.status > 400) {
                throw new Error(response.data.message)
            } 
            return response.data
        },
        onSuccess: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['categories'] })

            await queryClient.setQueryData(['categories'], (oldCategories: category[] | []) => {

                return [
                    ...oldCategories,
                    data.newCategory
                ]
            })
            setCategoryName('')
            setModal(false)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <Dialog open={modal} onOpenChange={setModal}>
            <DialogTrigger asChild>
                <Button
                className="w-[150px]"
                onClick={() => setModal(true)}
                >
                    Add
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[400px]">
                <DialogHeader>
                    <DialogTitle>
                        Add name
                    </DialogTitle>
                    <DialogDescription>
                        you can add as many as you can and also delete it if you want
                    </DialogDescription>
                </DialogHeader>
                <Input 
                    placeholder="Name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                />
                <div className="flex justify-around mt-4">
                    <Button
                    onClick={() => setModal(false)}
                    className="w-[140px]"
                    variant={'outline'}
                    >
                        Cancel
                    </Button>
                    <Button
                    onClick={() => addCategory()}
                    disabled={isPending}
                    className="w-[140px]"
                    >
                        Add
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default AddModal