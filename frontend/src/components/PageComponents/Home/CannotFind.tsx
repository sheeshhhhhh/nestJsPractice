import { FrownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const CannotFind = () => {
    const [searchParams] = useSearchParams()
    const [search, setSearch] = useState<string>()
    
    useEffect(() => {
        const s = searchParams.get('s') || '' 
        setSearch(s)
    }, [])

    return (
        <div className='flex justify-center mt-14'>
            <FrownIcon className='h-20 w-20 text-muted-foreground' />
            <div className='ml-4'>
                <h2 className='font-bold text-4xl text-muted-foreground'>
                    Failed to find what your looking
                </h2>
                <p className='font-medium text-xl'>
                    There is no result in search: {" "} 
                    <span className='underline underline-offset-2'>
                        {search}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default CannotFind