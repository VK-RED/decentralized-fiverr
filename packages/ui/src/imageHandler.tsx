'use client';

import { DivProps } from "@repo/common/types"
import { UploadImage } from "./uploadImage"
import { ImageRenderer } from "./imageRenderer"
import { useState } from "react";

export const ImageHandler = ({className}:DivProps) => {

    const [images,setImages] = useState<HTMLImageElement[]>();

    return (
        <div className={` ${className}`}>
            <ImageRenderer className="mt-10" images={images}/>
            <UploadImage className="mt-8" setImages={setImages}/>
        </div>
    )
}