import { category } from "./restaurant.types"

export type MenuInfo ={
    id: string,
    name: string,
    HeaderPhoto: string,
    description?: string,
    price: number,

    categoryId: string

    availability: boolean,

    restaurantId?: string,

    createdAt: Date
}

export type MenuInfoCategory = {
    category?: category,
} & MenuInfo

export type MenuForm = {
    name: string,
    description?: string,
    price: number,
    categoryId: string,
    availability: boolean
}