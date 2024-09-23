import { useState } from "react"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogTrigger } from "../../../ui/dialog"
import { Button } from "../../../ui/button"
import { DropdownMenuItem } from "../../../ui/dropdown-menu"
import MenuForm from "./MenuHeader/MenuForm"
import { MenuInfo } from "../../../../types/menu.types"

type UpdateMenuProps= {
  menu: MenuInfo
}

const UpdateMenu = ({
  menu
}: UpdateMenuProps) => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
        className="w-full justify-start p-0"
        variant={'ghost'}
        onClick={() => setOpen(true)} 
        >
          <DropdownMenuItem
          onSelect={e => e.preventDefault()}
          >
            Update
          </DropdownMenuItem>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Update Menu
          </DialogTitle>
        </DialogHeader>
        <MenuForm 
        setOpen={setOpen}
        type="update"
        initialValues={menu}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UpdateMenu