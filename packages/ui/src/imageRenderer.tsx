'use client';

import { DivProps } from "@repo/common/types";
import { useEffect } from "react";

export interface ImageRendererProps extends DivProps{
    images?:string[],
}

export const ImageRenderer = ({className,images}:ImageRendererProps) => {

    useEffect(()=>{
        if(images){
           console.log("Images present !");
        }
    },[images])

    if(!images){
        return null;
    }
    
    return (
        <div className={`flex flex-col items-center ${className}`}>

            <div className="mb-4">
                Uploaded Images
            </div>
            
            <div id="preview" className="grid md:grid-cols-5 max-w-6xl gap-x-2 gap-y-2">
                {
                    images &&
                    images.map((i,ind)=>(
                        <img className="w-[300px] h-[150px]" key={ind}  src={i}/>
                    ))
                }
            </div>

            {
                images?.length > 0 &&
                <button 
                    className="text-md mt-5 bg-black text-white px-2 py-1 rounded-md font-medium">
                    Submit
                </button>
            }
        </div>  
    )
}