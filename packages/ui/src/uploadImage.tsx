'use client';

import { UploadImageProps, UploadedFile } from "@repo/common/types";
import { useRef } from "react";

export const UploadImage = ({className,setImages}:UploadImageProps) => {

    const uploadRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        uploadRef.current?.click();
    }

    const setFiles = (e: React.ChangeEvent<HTMLInputElement>)=>{
        
        const files = e.target.files;
        const temp:UploadedFile[] = [];
        if(files){
            for(const file of files){
                if(temp.length < 5){
                    const imageURL = URL.createObjectURL(file);
                    temp.push({file,fileUri:imageURL});
                }
            }   
        }
        setImages((p)=>temp);
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