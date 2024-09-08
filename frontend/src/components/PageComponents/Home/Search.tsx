import { ChangeEvent, FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'
import { SearchIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../util/apiClient'

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('s') || ''
    const queryClient = useQueryClient()

    const changeSearchParams = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchParams({ s: e.target.value })
    }
    const { mutate, isPending } = useMutation({
        mutationKey: ['restaurant'],
        mutationFn: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault()
            const response = await apiClient.get(`/restaurant/GetManyRestaurants?search=${query || ''}`)
            return response.data
        },
        onError: (error) => {
            console.log(error) // make a toast for this later
        },
        onSuccess: async (data) => {
            await queryClient.setQueryData(['restaurants'], (oldData: any) => {
                return [
                    ...data
                ]
            })
        }
    })

    return (
        <form 
        onSubmit={mutate}
        className='max-w-[400px] w-full relative flex'>
            <Input
            placeholder='Search'
            onChange={(e) => changeSearchParams(e)}
            value={query}
            />
            <Button
            type='submit'
            className='absolute right-1'
            disabled={isPending}
            variant={'ghost'}
            >
                <SearchIcon />
            </Button>
        </form>
    )
}

export default Search