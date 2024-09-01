import { useAuthContext } from '../../../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../util/apiClient'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../ui/table'
import { category } from '../../../../types/restaurant.types'
import { Card } from '../../../ui/card'
import CategoryMenu from './CategoryMenu'

const CategoriesCollection = () => {
  const { user } = useAuthContext()

  const { data: Categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get(`/category/${user?.restaurant?.id}`)
      return response.data as category[] | []
    }
  })

  if(isLoading) return null

  return (
    <Card className='min-h-[500px] max-h-[700px]'>
      <Table>
        <TableHeader>

          <TableRow>
            
            <TableHead className='w-[800px] text-xl'>
              Name
            </TableHead>
            <TableHead className='text-xl'>
              
            </TableHead>
          </TableRow>

        </TableHeader>
        <TableBody>
          {Categories?.map((category) => {
            return (
              <TableRow key={category.id}>
                <TableCell className='font-bold text-lg'>{category.CategoryName}</TableCell>
                <TableCell>
                  <CategoryMenu 
                  categoryId={category.id} 
                  />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </Card>
  )
}

export default CategoriesCollection