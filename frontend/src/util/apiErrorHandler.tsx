import toast from "react-hot-toast"

type apiErrorHandlerParams = {
    error: string,
    status?: number,
    message?: string
}

const apiErrorHandler = async ({
    error, status, message
}: apiErrorHandlerParams) => {
    
    const diplayError = async (error: string, message?: string) => {
        toast.error(error)
        await sleep(1000)
        message && toast.error(message)
    }

    switch(status) {
        case 406:
            await diplayError(error, message)
            break;
        case 401:
            await diplayError(error, message)
            break;
        case 501: 
            //unique constraints prisma
            await diplayError(error, message)
            break;
        default:
            console.log('internal server')
    }
  
    return null 
}

// duration mili seconds
export const sleep = async (duration: number) =>  {
    await new Promise(resolve => setTimeout(resolve, duration))
    return
}

export default apiErrorHandler