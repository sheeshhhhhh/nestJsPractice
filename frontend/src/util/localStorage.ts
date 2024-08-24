


// the key will be the one we are getting
export const useLocalStorage = <T> (key: string) => {
    
    const setItem = (value: T): void => {
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    const getItem = (): T | undefined => {
        try {
            const item = window.localStorage.getItem(key)

            if(item) {
                return JSON.parse(item)
            } else {
                return undefined
            }
        } catch (error: any) {
            console.log(error.message)
        }
    }
 
    const removeItem = (): void => {
        try {
            window.localStorage.removeItem(key)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return { setItem, getItem, removeItem }
}