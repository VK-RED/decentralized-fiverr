'use client';

import { DivProps } from "@repo/common/types";
import { useEffect, useRef } from "react";

export interface ImageRendererProps extends DivProps{
    images?:HTMLImageElement[],
}

export const ImageRenderer = ({className,images}:ImageRendererProps) => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        if(images){
            images.map((img)=>{
                previewRef.current?.appendChild(img)
            })
        }
    },[images])

    if(!images){
        return null;
    }
    
    return (
        <div className={`flex flex-col items-center border w-full  ${className}`}>

            <div className="mx-4">
                Uploaded Images
            </div>
            
            <div id="preview" className="flex space-x-3 max-w-xl"
                    ref={previewRef}>

            </div>
        </div>  
    )
}