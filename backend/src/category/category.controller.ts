import { Body, Controller, Param, Post, Get, Patch, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/CreateCategory.dto';
import { isBusinessOwner } from 'src/guards/businessOwner.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get(':restaurantId')
    async GetCategories(@Param('restaurantId') restaurantId: string) {
        return this.categoryService.GetCategories(restaurantId)
    }

    @UseGuards(isBusinessOwner)
    @Post(':restaurantId')
    async CreateCategory(@Body() body: CreateCategoryDto, @Param('restaurantId') 
    restaurantId: string) { 
        return this.categoryService.CreateCategory(restaurantId, body)
    }
 
    // make a way to verify the owner with category id not as params

    @Delete(':categoryId')
    async DeleteCategory(@Param('categoryId') categoryId: string) {
        return this.categoryService.DeleteCategory(categoryId)
    }
     
    @Patch(':categoryId')
    async UpdateCategory(@Param("categoryId") categoryId: string,@Body() 
    body: UpdateCategoryDto) {
        return this.categoryService.UpdateCategory(categoryId, body)
    }

}
    