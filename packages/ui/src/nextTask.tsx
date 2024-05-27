"use client";

import { BACKEND_URL } from "@repo/common/messages";
import { DivProps, NextTaskResult, NextTaskType, SubmissionInput, SubmissionResult } from "@repo/common/types";
import { useEffect, useState } from "react";
import { NextTaskOpts } from "./nextTaskOpts";

export const NextTask = ({className}:DivProps) => {

    const[nextTask,setNextTask] = useState<NextTaskType>();

    useEffect(()=>{
        getNextTask();
    },[])

    const handleSubmit = async(optionId:number)=>{
        await postSubmission(optionId);
        await getNextTask();
    }

    const getNextTask = async()=>{
        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}v1/worker/nextTask`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            }
        }
        );
        const data:NextTaskResult = await res.json();
        console.log(data);
        if(data.task){
            const {title,options} = data.task;
            setNextTask((p)=>({
                options,
                title,
            }))
        }
        else if(data.message){
            console.log(data.message);
        }
    }

    const postSubmission = async(optionId:number)=>{
        const taskId = nextTask?.options[0]?.taskId;
        if(!taskId) return;
        const token = localStorage.getItem("token");
        const body:SubmissionInput={optionId:optionId.toString(),taskId};
        const res = await fetch(`${BACKEND_URL}v1/worker/submission`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "authorization":`Bearer ${token}`
            },
            body:JSON.stringify(body)
        });
        const data:SubmissionResult = await res.json();
        if(data.amount){
            console.log(`You have got ${data.amount}`);
            await getNextTask();
        }
        else{
            console.log(data.message);
        }
    }

    return (
        <div className={`flex flex-col items-center mt-10 px-8 ${className}`}>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                {nextTask?.title || "No works left !!"}
            </h1>

            <div className="flex items-center justify-center gap-x-2 mt-5 max-w-screen-2xl">
                {
                    nextTask?.options.map((nt)=>(
                        <div key={nt.id} onClick={()=>handleSubmit(nt.id)}>
                            <NextTaskOpts className="cursor-pointer"
                                 imgUrl={nt.img_url}/>
                        </div>
                        
                    ))
                }
            </div>
            
            
        </div>
    )
}