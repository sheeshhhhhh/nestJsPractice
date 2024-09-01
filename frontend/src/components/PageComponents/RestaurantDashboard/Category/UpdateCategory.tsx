import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle, DialogDescription, DialogFooter } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { useState } from "react"
import { category } from "../../../../types/restaurant.types"
import { Input } from "../../../ui/input"
import apiClient from "../../../../util/apiClient"
import { DropdownMenuItem } from "../../../ui/dropdown-menu"

type UpdateCategoryProps = {
  categoryId: string
}

const UpdateCategory = ({
  categoryId
}: UpdateCategoryProps) => {
  const [modal, setModal] = useState<boolean>(false)
  const queryClient = useQueryClient() 
  const listOfCategories = queryClient.getQueryData(['categories']) as category[]
  const initialCategoryName = listOfCategories.find((category) => category.id === categoryId)?.CategoryName

  const [categoryName, setCategoryName] = useState(initialCategoryName || '')

  const handleSelect = (event: any) => { 
    event.preventDefault() // Prevents the dropdown menu from closing
    setModal(true)         // Opens the modal just in case
  }

  const { mutate: UpdateItem, isPending } = useMutation({
    mutationKey: ['updateItem', categoryId],
    mutationFn: async () => {
      const response = await apiClient.patch(`/category/${categoryId}`, {
        CategoryName: categoryName
      })
      console.log(response)
      return response.data
    },
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: ['categories']})

      queryClient.setQueryData(['categories'], (oldCategories: category[] | []) => {
        return [
          ...oldCategories.map((category) => {
            if(category.id === categoryId) {
              const newCategoryData = {
                ...category,
                CategoryName: data.newCategory.CategoryName
              }
              return newCategoryData
            }
            return category
          })
        ]
      })

      setCategoryName('')
      setModal(false)
    }
  })

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogTrigger asChild>
        <Button
        className="w-full justify-start p-0"
        variant={'ghost'}
        onClick={() => setModal(true)}
        >
          <DropdownMenuItem onSelect={handleSelect} >Update</DropdownMenuItem>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>
            Update Category
          </DialogTitle>
          <DialogDescription>
            you can update your categories name as many times as you want
          </DialogDescription>
        </DialogHeader>
        <Input 
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        />
        <DialogFooter className="sm:justify-around mt-2">

          <Button
          disabled={isPending}
          className="w-[140px]"
          variant={'outline'}
          onClick={() => setModal(false)}
          >
            Cancel
          </Button>

          <Button
          disabled={isPending}
          className="w-[140px]"
          onClick={() => UpdateItem()}
          >
            Save
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCategory