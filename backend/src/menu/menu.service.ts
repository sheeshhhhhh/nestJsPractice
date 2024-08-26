import { Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { prisma } from '../../prisma/db'
import { CreateMenuDto } from './dto/CreateMenu.dto';
import { UpdateMenuDto } from './dto/UpdateMenu.dtio';
import { getAllMenusDto } from './dto/getAllMenus.dto';

@Injectable()
export class MenuService {

    async getAllMenus(restaurantId: string, { category }: getAllMenusDto) {

        const getMenus = await prisma.menu.findMany({
            where: {
                AND: [
                    {restaurantId: restaurantId},
                    {category: category}
                ]
            }
        })
        
        return getMenus
    }

    async ChangeAvailability(id: string, isAvailable: boolean) {
        
        const updateAvailability = await prisma.menu.update({
            where: {
                id: id
            },
             data: {
                availability: isAvailable
             }
        })

        return updateAvailability
    }

    async GetMenuItem(id: string) {
        
        const getPrismaMenu = await prisma.menu.findUnique({
            where: {
                id: id
            }
        })

        return getPrismaMenu
    }

    async CreateMenuItem(req: any, {
        name, description, price, category, availability,
        restaurantId
    } : CreateMenuDto) {
        if(req.user.role !== 'Business') {
            throw new UnauthorizedException("only business owner can create menu")
        }

        const userId = req.user.sub
        const Availability = availability || false // default is false

        const createPrismaMenu = await prisma.menu.create({
            data: {
                name: name,
                description: description || '',
                price: price,
                category: category || '',
                availability: Availability,
                restaurantId: restaurantId
            }
        })

        return createPrismaMenu
    }

    async DeleteMenuItem(id: string) {

        // only id is gonna be user don't use anything

        const deletePrismaMenu = await prisma.menu.delete({
            where: {
                id: id
            }
        })

        return {
            success: true,
            message: "menu deleted"
        }
    }

    async UpdateMenuItem(id: string, body: UpdateMenuDto) {

        const updatePrismaMenu = await prisma.menu.update({
            where: {
                id: id
            },
            data: {
                ...body
            }
        })

        return {
            success: true,
            message: 'successfully change menu info',
            newMenu: updatePrismaMenu
        }
    }

}
