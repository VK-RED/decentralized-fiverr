'use client';

import { BACKEND_URL } from "@repo/common/messages";
import { GetTaskResult, TaskOptions } from "@repo/common/types";
import { TaskOptionsRenderer } from "@repo/ui/taskOptionsRenderer";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function TaskViewPage(){

    const {id} = useParams<{id:string}>();
    const [taskOptions,setTaskOptions] = useState<TaskOptions>();
    const [taskTitle,setTaskTitle] = useState("");

    useEffect(()=>{
        getTask();
    },[])

    const getTask = async()=>{
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}v1/user/task/${id}`,{
            method:"GET",
            headers:{
                "Content-Type": "application/json",
                "authorization": "Bearer "+token,
            }
        });
        const data:GetTaskResult = await res.json();
        if(data.allOptions){
            const result = data.allOptions;
            console.log(result);
            setTaskOptions((p)=>result);
            if(data.title){
                const t = data.title;
                setTaskTitle((p)=>t)
            }
        }
        
    }

    return (
        <div className="flex items-center justify-center">
            <TaskOptionsRenderer taskOptions={taskOptions} title={taskTitle}/>
        </div>
    )
}