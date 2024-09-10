import { ChangeEvent,  Dispatch,  FormEvent,  SetStateAction,  useState } from 'react'
import { Input } from '../../../../ui/input'
import { Textarea } from '../../../../ui/textarea'
import { MenuForm as MenuFormType, MenuInfo } from '../../../../../types/menu.types'
import SelectCategories from './SelectCategories'
import { Button } from '../../../../ui/button'
import apiClient from '../../../../../util/apiClient'
import { useAuthContext } from '../../../../../context/AuthContext'
import { useQueryClient } from '@tanstack/react-query'
import apiErrorHandler from '../../../../../util/apiErrorHandler'
import HeaderPhotoInput from '../../../../common/HeaderPhotoInput'
import TransferForm from '../../../../../types/TransferForm'

type MenuFormProps = {
    setOpen?: Dispatch<SetStateAction<boolean>>,
    type: 'add' | 'update',
    initialValues?: MenuInfo;
}

const MenuForm = ({
    setOpen,
    type='add',
    initialValues
}: MenuFormProps) => {
    const [menuInfo, setMenuInfo] = useState<MenuFormType>({
        name: initialValues?.name || '',
        description: initialValues?.description || '',
        price: initialValues?.price || 0,
        categoryId: initialValues?.categoryId || '',
        availability: initialValues?.availability || false,
    })
    const [file, setFile] = useState<any>(initialValues?.HeaderPhoto);
    const { user } = useAuthContext()
    const queryClient = useQueryClient();

    const changeEvent = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setMenuInfo((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        // make this a form to handle files 
        e.preventDefault()

        const formData = TransferForm({
            ...menuInfo,
            restaurantId: user?.restaurant?.id,
            MenuPhoto: file
        })

        const response = type === 'add' ? 
        // for creating menu
        await apiClient.post('/menu', formData) : 
        // for updating menu
        await apiClient.patch(`/menu/${initialValues?.id}`, formData)

        if(response.status > 400) {
            const message = response.data.message;
            const error = response.data.error;
            return apiErrorHandler({ error, message, status:response.status })
        }
        queryClient.invalidateQueries({ queryKey: ['menus'] })

        setOpen && setOpen(false)
    }
    
    return (
        <form 
        onSubmit={submitForm}
        className='space-y-3'>
            <HeaderPhotoInput 
            setFile={setFile}
            file={file}
            />
            <Input 
            value={menuInfo.name}
            name='name'
            onChange={changeEvent}
            placeholder="name"
            />
            <Textarea
            value={menuInfo.description}
            name='description'
            onChange={changeEvent}
            placeholder="description"
            />
            <div className="flex gap-3">
                <Input 
                value={menuInfo.price}
                onChange={(e) => setMenuInfo(prev => ({...prev, price: e.target.valueAsNumber}))}
                placeholder="price"
                type="number"
                />
                <SelectCategories menuInfo={menuInfo} setMenuInfo={setMenuInfo} />
            </div>
            <div className='flex justify-center mt-2'>
                <Button 
                type='submit'
                className='max-w-[300px] w-full'>
                    Save
                </Button>
            </div>
        </form>
    )
}


export default MenuForm