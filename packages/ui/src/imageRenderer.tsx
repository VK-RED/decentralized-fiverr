'use client';

import { BACKEND_URL, TASK_SUCCESS, UPLOAD_SUCCESS } from "@repo/common/messages";
import { ImageRendererProps } from "@repo/common/types";
import type { PostTask, PostTaskResult } from "@repo/common/types";
import { PublicKey, SystemProgram, useConnection, useWallet, Transaction } from "@repo/sol/solana-configs";
import { useRouter } from 'next/navigation'
import { useState } from "react";

export const ImageRenderer = ({className,images,task}:ImageRendererProps) => {
    const router = useRouter();
    //send money from userwallet to your wallet of 0.1 sol
    const [txSignature,setTxsignature]=useState("");
    const {publicKey,sendTransaction} = useWallet();
    const{connection} = useConnection();

    const transferSol = async()=>{
        if(publicKey){
            
            const masterWallet = process.env.NEXT_PUBLIC_MASTER_WALLET as string;
            const transaction = new Transaction()
            const transferInstruction = SystemProgram.transfer({
                fromPubkey:publicKey,
                toPubkey:new PublicKey(masterWallet),
                lamports:1_000_000_00 // 0.1 SOL
            });
            transaction.add(transferInstruction);


            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight }
            } = await connection.getLatestBlockhashAndContext();
    
            const signature = await sendTransaction(transaction, connection, { minContextSlot });
    
            await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
            setTxsignature((p)=>signature);
        }
       
    }

    const uploadToS3 = async(presignedUrls:{url:string}[]) => {
        if(!images)return;
        if(!task){
            console.log("Enter task name !");
            return;
        }
        if(images.length !== presignedUrls.length){
            console.error("PresignedUrls mismatch");
            return;
        };
        const promises:Promise<Response>[] = [];
        try {
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
            await Promise.all(promises);
            console.log("Uploaded the Images Successfully !");
            return UPLOAD_SUCCESS;
        } catch (error) {
            console.error(error);
            const message = "Error in Uploading the Images";
            return message;
        }
        
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
        const responses:Promise<{url:string,key:string}>[] = [];
        results.map((result)=>{
            const data = result.json();
            responses.push(data);
        });
        const urls = await Promise.all(responses);
        return urls;
    }

    const createTask = async(presignedUrls:{key:string}[]) => {
        if(!task){
            console.log("Enter task name !");
            return;
        }
        
        const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string;
        const urls = presignedUrls.map((u)=>(`${CLOUDFRONT_URL}/${u.key}`));
        const signature = txSignature;

        if(!signature){
            console.log("Can't submit the task as there is no Signature ID !!");
        }

        const body : PostTask = {
            title:task,
            signature,
            urls
        }
        const token = localStorage.getItem('token') as string;

        const res = await fetch(`${BACKEND_URL}v1/user/task`,{
            method:"POST",
            body:JSON.stringify(body),
            headers:{
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,
            }
        });
        const {message,taskId} :PostTaskResult = await res.json();
        if(message !== TASK_SUCCESS){
            console.error(message);
        }
        else{
            console.log(message);
            return taskId;
        }
    }

    const handleSubmit = async() => {
        
        const presignedUrls = await getPresignedUrls();
        if(!presignedUrls){
            console.log("Error in Getting Presigned Urls !");
            return;
        }
        const uploadRes = await uploadToS3(presignedUrls);
        if(uploadRes === UPLOAD_SUCCESS){
            //Only if everything succeeds create a Task
            const taskId = await createTask(presignedUrls);
            router.push(`/task/${taskId}`);
        }
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
                <button onClick={()=>{
                    if(txSignature){
                        handleSubmit();
                    }
                    else{
                        transferSol();
                    }
                }}
                    className="text-md mt-5 bg-black text-white px-2 py-1 rounded-md font-medium">
                    {txSignature ? 'Submit' : 'Pay 0.1 SOL'}
                </button>
            }
        </div>  
    )
}