import { Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from '@nestjs/common';
import { prisma } from 'prisma/db';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/CreateCategory.dto';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {
 

    async searchCategory(restaurantId: string, search: string) {
        const query = search ? {
            CategoryName: {
                contains:  search || '',
                mode: 'insensitive' as Prisma.QueryMode
            }
        } : {}

        const GetCategories = await prisma.category.findMany({
            where: {
                AND: {
                    ...query,
                    restaurantId: restaurantId
                }
            }
        })

        return GetCategories
    }

    // mainly for editing categories
    async GetCategories(restaurantId: string): Promise<Category[] | undefined> {
        const getBusinessCategories = await prisma.category.findMany({
            where: {
                restaurantId: restaurantId
            }
        })

        return getBusinessCategories
    }

    async CreateCategory(restaurantId: string, { CategoryName } : CreateCategoryDto)
    : Promise<any | undefined> {
        try {
            const createCategory =  
            await prisma.category.create({
                data: {
                    restaurantId: restaurantId,
                    CategoryName: CategoryName
                }
            })
    
            return {
                success: true,
                message: "successfully created category",
                newCategory: createCategory
            }
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new NotImplementedException("category already exist")
                }
            } else {
                throw new Error(error)
            }
        }
    }

    async DeleteCategory(categoryId: string) {
        try {
            const deleteCategory = await prisma.category.delete({
                where: {
                    id: categoryId
                }
            }) 
    
            return {
                success: true,
                message: "category deleted",
                deletedId: deleteCategory.id
            }
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException("category does not exist!");
                }
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async UpdateCategory(categoryId: string, { CategoryName }: UpdateCategoryDto) {
        try {
            const updateCategory = await prisma.category.update({
                where: {
                    id: categoryId
                },
                data: {
                    CategoryName: CategoryName
                }
            })
    
            return {
                success: true,
                message: "category updated",
                newCategory: updateCategory
            }
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                console.log(error)
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

}
