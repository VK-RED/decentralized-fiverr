'use client';

import { ImageRendererProps } from "@repo/common/types";
import { useEffect } from "react";

export const ImageRenderer = ({className,images}:ImageRendererProps) => {

    useEffect(()=>{
        if(images){
           console.log("Images present !");
        }
    },[images])

    const handleSubmit = async() => {
        //get a presigned-URL

        //TODO : FIX THE TOKEN LOGIC TO GET FROM BACKEND
        const result = await fetch("http://localhost:8000/v1/user/signin",{
            method:"POST"
        });
        const d = await result.json();
        const jwtToken = d.token;
        
        const res = await fetch("http://localhost:8000/v1/user/presignedUrl",{
            method:"GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": "Bearer "+jwtToken,
            },
        });
        const data = await res.json();
        const uploadUrl = data.url;
        console.log("Upload URL : ",uploadUrl);

        //till now got the upload URL
        //now convert the photo to dataURI and upload it

        
    }

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
                        <img className="w-[300px] h-[150px]" key={ind}  src={i.fileUri}/>
                    ))
                }
            </div>

            {
                images?.length > 0 &&
                <button onClick={handleSubmit}
                    className="text-md mt-5 bg-black text-white px-2 py-1 rounded-md font-medium">
                    Submit
                </button>
            }
        </div>  
    )
}