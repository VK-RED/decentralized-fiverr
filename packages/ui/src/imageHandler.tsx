'use client';

import { ImageHandlerProps, UploadedFile } from "@repo/common/types"
import { UploadImage } from "./uploadImage"
import { ImageRenderer } from "./imageRenderer"
import { useState } from "react";

export const ImageHandler = ({className,task}:ImageHandlerProps) => {

    const [images,setImages] = useState<UploadedFile[]>();

    return (
        <div className={`w-full flex flex-col items-center ${className}`}>
            <ImageRenderer className="mt-3" images={images} task={task}/>
            <UploadImage className="mt-8" setImages={setImages}/>
        </div>
    )
}