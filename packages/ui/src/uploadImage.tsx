'use client';

import { DivProps } from "@repo/common/types";
import { Dispatch, useRef } from "react";

export interface UploadImageProps extends DivProps{
    setImages: Dispatch<React.SetStateAction<HTMLImageElement[]|undefined>>
}

export const UploadImage = ({className,setImages}:UploadImageProps) => {

    const uploadRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        uploadRef.current?.click();
    }

    const setFiles = (e: React.ChangeEvent<HTMLInputElement>)=>{
        
        const files = e.target.files;
        let arr : HTMLImageElement[]= [];
        if(files){
            for(const file of files){
                let newImg = new Image(300,300);
                newImg.src = URL.createObjectURL(file);
                arr.push(newImg);
            }   
        }
        setImages((p)=>arr);
    }


    return (
        <div className={`space-y-3 ${className}`}>
            <div>
                Add Images
            </div>
            <div className={`border border-dashed h-[100px] w-[100px] flex flex-col items-center justify-center border-gray-400 font-bold cursor-pointer`}
                onClick={handleClick}
            >
                +
            </div>
            <input accept="image/*" type="file" multiple ref={uploadRef} className="hidden" 
                    onChange={(e)=>setFiles(e)}/>
        </div>
    )
}