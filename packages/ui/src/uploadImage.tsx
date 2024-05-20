'use client';

import { DivProps } from "@repo/common/types";
import { useEffect, useRef, useState } from "react";

export const UploadImage = ({className}:DivProps) => {

    const uploadRef = useRef<HTMLInputElement>(null);
    const [images,setImages] = useState<FileList|null>();

    useEffect(()=>{
        if(images){
            console.log(images);
        }
    },[images])

    const handleUpload = () => {
        uploadRef.current?.click();
    }

    const setFiles = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const files = e.target.files;
        setImages((p)=>files);
    }


    return (
        <div className={`space-y-3 ${className}`}>
            <div>
                Add Images
            </div>
            <div className={`border border-dashed h-[100px] w-[100px] flex flex-col items-center justify-center border-gray-400 font-bold cursor-pointer`}
                onClick={handleUpload}
            >
                +
            </div>
            <input accept="image/*" type="file" multiple ref={uploadRef} className="hidden" onChange={(e)=>setFiles(e)}/>

        </div>
        
    )
}