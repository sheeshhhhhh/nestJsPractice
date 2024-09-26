


export type Review = {
    id: string,
    rating: number,
    userId: string,
    restaurantId: string,
    comment: string,
    user: {
        name: string,
        userInfo: {
            profile: string
        }
    },
    
    createdAt: string,
}

export type Reviews = Review[]