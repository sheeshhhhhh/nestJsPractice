import { useEffect, useState } from "react"


const useDebounce = (value: any, delay: number) => {
    const [debounceValue, setDebounceValue] = useState<any>()

    useEffect(() => {
        const timeOut = setTimeout(() => {
            setDebounceValue(value)
        }, delay);

        return () => {
            clearTimeout(timeOut)
        }

    }, [value, delay])

    return debounceValue
}

export default useDebounce