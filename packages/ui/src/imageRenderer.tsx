'use client';

import { BACKEND_URL } from "@repo/common/messages";
import { ImageRendererProps } from "@repo/common/types";

export const ImageRenderer = ({className,images,task}:ImageRendererProps) => {

    const uploadToS3 = async(presignedUrls:{url:string}[]) => {
        if(!images)return;
        if(images.length !== presignedUrls.length){
            console.error("PresignedUrls mismatch");
            return;
        };
        const promises:Promise<Response>[] = [];
        for(let i = 0; i < images.length; i++){
            const uploadedFile = images[i];
            const uploadUrl = presignedUrls[i];
            if(!uploadedFile || !uploadUrl){
                console.log("File or URI not present");
                return
            }
            const myHeaders = new Headers({ 'Content-Type': 'image/*' });
            const promiseRes = fetch(uploadUrl.url,{
                method:"PUT",
                headers: myHeaders,
                body:uploadedFile.file,
            });
            promises.push(promiseRes);
        }
        const fetchRes = await Promise.all(promises);
        console.log(fetchRes);
        window.console.log("Uploaded the Images Successfully !");
    }

    const getPresignedUrls = async()=>{
        if(!images) return;
        const fetchPromises:Promise<Response>[] = [];

        //Get the jwt token from localstorage
        const jwtToken = localStorage.getItem('token') as string;
    
        images.map((i)=>{
            const resPromise = fetch(`${BACKEND_URL}v1/user/presignedUrl`,{
                method:"GET",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer "+jwtToken,
                },
            });
            fetchPromises.push(resPromise);
        });
        
        const results = await Promise.all(fetchPromises);
        const responses:Promise<{url:string}>[] = [];
        results.map((result)=>{
            const data = result.json();
            responses.push(data);
        });
        const urls = await Promise.all(responses);
        return urls;
    }

    const handleSubmit = async() => {
        //get a presigned-URL
        const presignedUrls = await getPresignedUrls();
        if(!presignedUrls){
            console.log("Error in Getting Presigned Urls !");
            return;
        }
        await uploadToS3(presignedUrls);
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