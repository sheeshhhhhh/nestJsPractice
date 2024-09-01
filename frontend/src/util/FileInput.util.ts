import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";

export type fileOnDragEvent = React.DragEvent<HTMLDivElement | HTMLLabelElement>;

export const LoadDataUrl = (file: any, setterFunction: Dispatch<SetStateAction<any>>) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
        setterFunction(e.target.result)
    }
    reader.readAsDataURL(file)
}

export const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: Dispatch<SetStateAction<any>>,
    setPreviewFile: Dispatch<SetStateAction<any>>
) => {
    if(!e.target.files) return
    const file = e.target.files[0];
    setFile(file)

    if(file) {
        LoadDataUrl(file, setPreviewFile)
    }
}

export const handleDrop = (
    e: fileOnDragEvent,
    setFile: Dispatch<SetStateAction<any>>,
    setPreviewFile: Dispatch<SetStateAction<any>>
) => {
    e.preventDefault()
    if(!e.dataTransfer.files) {
        return
    }

    const droppedFiles = e.dataTransfer.files[0]
    setFile(droppedFiles)
        
    if(droppedFiles) {
        LoadDataUrl(droppedFiles, setPreviewFile) 
    }
}

export const handleDrag = (
    e: fileOnDragEvent
) => {
    e.preventDefault()
}