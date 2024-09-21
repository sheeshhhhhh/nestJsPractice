import { ComponentProps } from "react"
import { cn } from "../../lib/utils"

type AvatarProfileProps = {
    src: string,
    alt?: string,
    className?: string
} 

const AvatarProfile = ({
    src,
    alt,
    className,
    ...props
}: AvatarProfileProps & ComponentProps<'img'>) => {

    if(!src) {
        return <h2 className="text-red-600 text-lg">please input source</h2>
    }

    return (
        <div className="flex justify-center items-center border border-1 rounded-full">
            <img 
            {...props}
            alt={alt}
            className={cn('size-[42px] rounded-full', className)}
            loading="lazy"
            src={src}
            />
        </div>
    )
}

export default AvatarProfile