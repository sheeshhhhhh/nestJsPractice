import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/CreateMenu.dto';
import { UpdateMenuDto } from './dto/UpdateMenu.dtio';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { getAllMenusDto } from './dto/GetAllMenus.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import diskMulterStorage from 'src/util/discMulterStorage';

@UseGuards(JwtAuthGuard)
@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService) {}

    @Get('getAll/:restaurantId')
    async getAllMenus(@Param('restaurantId') restaurantId: string, @Body() body: getAllMenusDto) {
        return this.menuService.getAllMenus(restaurantId, body)
    }

    @Post('change-availability/:id')
    async ChangeAvailability(@Param('id') id: string, @Body() body: { available: boolean }) {
        return this.menuService.ChangeAvailability(id, body.available)
    }

    @Get('searchMenu')
    async SearchMenu(@Query() query: { search: string, restaurantId?: string }) {
        return this.menuService.SearchMenu(query.search, query.restaurantId)
    }

    // about menu
    @Post() 
    @UseInterceptors(
        FileInterceptor('MenuPhoto', {
            storage: diskMulterStorage('uploads/MenuPhoto')
        })
    )
    async CreateMenuItem(@Request() req: any, @Body() body: CreateMenuDto, 
    @UploadedFile() file: Express.Multer.File) {
        return this.menuService.CreateMenuItem(req, body, file)
    }

    @Get(':id')
    async getMenuItem(@Param('id') id: string) {
        return this.menuService.GetMenuItem(id)
    }

    @Delete(':id')
    async DeleteMenuItem(@Param('id') id: string, @Request() req: any) {
        return this.menuService.DeleteMenuItem(id)
    }

    @Patch(':id') 
    @UseInterceptors(
        FileInterceptor('MenuPhoto', {
            storage: diskMulterStorage('uploads/MenuPhoto')
        })
    )
    async UpdateMenuItem(@Param('id') id: string, @Body() body: UpdateMenuDto, 
    @UploadedFile() file: Express.Multer.File) { 
        return this.menuService.UpdateMenuItem(id, body, file);
    }

}
