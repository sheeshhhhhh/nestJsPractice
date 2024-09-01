import { Dispatch, SetStateAction, useState } from "react"
import { handleDrag, handleDrop, handleFileChange } from "../../../util/FileInput.util"
import { Button } from "../../ui/button"
import { Icon, UploadIcon } from 'lucide-react';


type HeaderPhotoInputProps = {
    file: any, // this could be a string | File
    setFile: Dispatch<SetStateAction<any>>,
    initialHeaderPhoto?: any,

    // the size configs is base on pixels size or px 
    size?: {
        height: number,
        width: number
    },
    iconSize?: number
}

const HeaderPhotoInput = ({
    file, 
    setFile,
    initialHeaderPhoto,
    size,
    iconSize // 
}: HeaderPhotoInputProps) => {
    const [previewFile, setPreviewFile] = useState<any>(initialHeaderPhoto || undefined)

    //Size Configs

    const Size = size || {
        height: 170,
        width: 320
    }
    const IconSize = iconSize || 60 

    return (
        <div 
        style={{
            height: Size.height + 'px',
            width: Size.width + 'px'
        }}
        className={`mx-auto`}>
            <div>
                {
                    previewFile &&
                    (
                        <div 
                        style={{
                            height: Size.height + 'px',
                            width: Size.width + 'px'
                        }}
                        className={`rounded-lg`}>
                            <img 
                            style={{
                                width: Size.width,
                                height: Size.height,
                            }}
                            src={previewFile} />
                        </div>
                    ) 
                }
            </div>
            {!previewFile && <label 
            style={{
                height: Size.height + 'px',
                width: Size.width + 'px'
            }}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, setFile, setPreviewFile)}
            >
                <div 
                style={{
                    height: Size.height + 'px',
                    width: Size.width + 'px'
                }}
                className={`rounded-lg border-2 border-muted-foreground border-dashed
                flex justify-center items-center`}>
                    <UploadIcon 
                    className={`size-[${IconSize}px] text-muted-foreground`}
                    />
                </div>
                <input 
                onChange={(e) => handleFileChange(e, setFile, setPreviewFile)}
                hidden
                type="file" 
                />
            </label>}

            <div aria-label="footer">
                {
                file &&
                <Button 
                className="w-[120px]"
                variant={'destructive'}>
                    Remove
                </Button> 
                }
            </div>
        </div>
    )
}

export default HeaderPhotoInput