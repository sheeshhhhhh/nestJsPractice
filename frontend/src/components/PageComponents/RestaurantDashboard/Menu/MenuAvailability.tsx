import { useState } from "react"
import { Dialog, DialogHeader, DialogTrigger, DialogTitle, DialogContent } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { DropdownMenuItem } from "../../../ui/dropdown-menu"
import { Select, SelectTrigger, SelectContent, SelectItem } from "../../../ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import apiClient from "../../../../util/apiClient"
import apiErrorHandler from "../../../../util/apiErrorHandler"
import { MenuInfo } from "../../../../types/menu.types"

type MenuAvailabilityProps = {
    menuId: string,
    menuAvailability: boolean
}

const MenuAvailability = ({
    menuId,
    menuAvailability
}: MenuAvailabilityProps) => {
    const [open, setOpen] = useState<boolean>(false)
    const [available, setAvailable] = useState(menuAvailability)
    const isAvailable = available ? 'Available' : 'Not Available'
    const queryClient = useQueryClient();

    const changeAvailability = (value: string) => {
        if(value === 'Available') {
            setAvailable(true)
        } else if(value === 'Not Available') {
            setAvailable(false)
        }
    }

    const { mutate: saveAvailability, isPending } = useMutation({
        mutationKey: ['saveAvailability'],
        mutationFn: async () => {
            const response = await apiClient.post(`/menu/change-availability/${menuId}`, {
                available: available
            })
            if(response.status > 400) {
                const message = response.data.message;
                const error = response.data.error;
                return apiErrorHandler({ error, message, status: response.status })
            }
            return response.data as MenuInfo
        },
        onSuccess: async (data) => {
            await queryClient.cancelQueries({ queryKey: ['menus'] });
            queryClient.setQueryData(['menus'], (oldData: MenuInfo[]) => {
                return [
                    ...oldData.map((menu) => {
                        if(menu.id === data?.id) {
                            return data
                        }   
                        return menu
                    }),
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
                    <DropdownMenuItem onSelect={e => e.preventDefault()}>availability</DropdownMenuItem>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Availability</DialogTitle>
                </DialogHeader>
                <Select onValueChange={value => changeAvailability(value)}>
                    <SelectTrigger>
                        <div>{isAvailable}</div>
                    </SelectTrigger>
                    <SelectContent>
                        {
                            available ?
                            <SelectItem value={'Not Available'}>Not Available</SelectItem> :
                            <SelectItem value={'Available'}>Available</SelectItem>
                        }
                    </SelectContent>
                </Select>
                <Button
                disabled={isPending}
                onClick={() => saveAvailability()}
                >
                    Save
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default MenuAvailability