import { category } from "./restaurant.types"

export type MenuInfo ={
    id: string,
    name: string,
    description?: string,
    price: number,

    categoryId: string
    category: category,

    availability: boolean,

    restaurantId?: string,

    createdAt: Date
}

export type MenuForm = {
    name: string,
    description?: string,
    price: number,
    categoryId: string,
    availability: boolean
}