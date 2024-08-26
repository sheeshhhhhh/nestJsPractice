import { Injectable } from '@nestjs/common';
import { prisma } from 'prisma/db';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/CreateCategory.dto';

@Injectable()
export class CategoryService {

    // mainly for editing categories
    async GetCategories(restaurantId: string) {
        const getBusinessCategories = await prisma.category.findMany({
            where: {
                restaurantId: restaurantId
            }
        })

        return getBusinessCategories
    }

    async CreateCategory(restaurantId: string, { CategoryName } : CreateCategoryDto) {

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
    }

    async DeleteCategory(categoryId: string) {

        const deleteCategory = await prisma.category.delete({
            where: {
                id: categoryId
            }
        }) 

        return {
            success: true,
            message: "category deleted"
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
