import { Injectable, NotImplementedException } from '@nestjs/common';
import { prisma } from 'prisma/db';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/CreateCategory.dto';
import { Category, Prisma } from '@prisma/client';

@Injectable()
export class CategoryService {

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
            const createCategory =  await prisma.category.create({
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
    }

    async UpdateCategory(categoryId: string, { CategoryName }: UpdateCategoryDto) {

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
    }

}
