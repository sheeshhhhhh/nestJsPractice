import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { prisma } from '../../prisma/db';
import { CreateMenuDto } from './dto/CreateMenu.dto';
import { UpdateMenuDto } from './dto/UpdateMenu.dtio';
import { getAllMenusDto } from './dto/GetAllMenus.dto';

@Injectable()
export class MenuService {

    async getAllMenus(restaurantId: string, { category }: getAllMenusDto) {

        const getMenus = await prisma.menu.findMany({
            where: {
                AND: [
                    {restaurantId: restaurantId},
                    {category: {
                        CategoryName: category 
                    }}
                ]
            },
            include: {
                category: true
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
            },
            include: {
                category: true
            }
        })

        return updateAvailability
    }

    async SearchMenu(search: string, restaurantId: string) {
        const query = search ? {
            OR: [
                {name: {
                contains:  search,
                mode: Prisma.QueryMode.insensitive
                }},
                {category: {
                    CategoryName: {
                        contains: search,
                        mode: Prisma.QueryMode.insensitive
                    }
                }}
            ]
        } : {}

        const getMenuSearch = await prisma.menu.findMany({
            where: {
                ...query,
                restaurantId: restaurantId
            },
            include: {
                category: true
            }
        })
        
        return getMenuSearch;
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
        name, description, price, availability,
        categoryId, restaurantId
    } : CreateMenuDto, file: Express.Multer.File) {
        if(req.user.role !== 'Business') {
            throw new UnauthorizedException("only business owner can create menu")
        }

        const Availability = availability && availability === 'true' ? true : false // default is false

        if(!categoryId) throw new BadRequestException('category is required')

        if(!file) {
            throw new BadRequestException('menu photo is required')
        }

        const linkPhoto = process.env.BASE_URL + '/MenuPhoto/' + file.filename

        const createMenu = await prisma.menu.create({
            data: {
                name: name,
                description: description || '',
                HeaderPhoto: linkPhoto,
                price: parseFloat(price),
                categoryId: categoryId,
                availability: Availability,
                restaurantId: restaurantId
            },
            include: {
                category: true
            }
        })

        return {
            success: true,
            message: 'successfully created menu',
            newMenu: createMenu
        }
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
            message: "menu deleted",
            deletedId: deletePrismaMenu.id
        }
    }

    async UpdateMenuItem(id: string, {
        name, description, price, availability, file:InitialFile
    }: UpdateMenuDto, file: Express.Multer.File) {
        const Availability = availability && availability === 'true' ? true : false
        // should delete the file that is being replace
        let photoLink: string = InitialFile || ''
        if(file) {
            photoLink = process.env.BASE_URL + '/MenuPhoto/' + file.filename
        }
        const updatePrismaMenu = await prisma.menu.update({
            where: {
                id: id
            },
            data: {
                HeaderPhoto: photoLink,
                availability: Availability,
                name,
                description,
                price: parseFloat(price)
            }
        })

        return {
            success: true,
            message: 'successfully change menu info',
            newMenu: updatePrismaMenu
        }
    }

}
