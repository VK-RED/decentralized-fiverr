'use client';

import { DivProps } from "@repo/common/types"
import { UploadImage } from "./uploadImage"
import { ImageRenderer } from "./imageRenderer"
import { useState } from "react";

export const ImageHandler = ({className}:DivProps) => {

    const [images,setImages] = useState<string[]>();

    return (
        <div className={`w-full flex flex-col items-center ${className}`}>
            <ImageRenderer className="mt-3" images={images}/>
            <UploadImage className="mt-8" setImages={setImages}/>
        </div>
    )
}