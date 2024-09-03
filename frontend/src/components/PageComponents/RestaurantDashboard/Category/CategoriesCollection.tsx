import { useAuthContext } from '../../../../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../../util/apiClient'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../../../ui/table'
import { category } from '../../../../types/restaurant.types'
import { Card } from '../../../ui/card'
import CategoryMenu from './CategoryMenu'


const CategoriesCollection = () => {
  const { user } = useAuthContext()

  // implement paginaition
  const { data: Categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get(`/category/${user?.restaurant?.id}`)
      return response.data as category[] | []
    }
  })

  if(isLoading) return null

  return (
    <Card className='max-h-[700px] overflow-auto'>
      <Table className='max-h-[700px] relative'>
        <TableHeader className='sticky top-0 bg-muted'>

          <TableRow>
            
            <TableHead className='w-[800px] text-xl'>
              Name
            </TableHead>
            <TableHead className='text-xl'>
              
            </TableHead>
          </TableRow>

        </TableHeader>

        <TableBody className='max-h-[700px] overflow-y-auto'>
          {Categories?.map((category) => {
            return (
              <TableRow className='h-[50px]' key={category.id}>
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