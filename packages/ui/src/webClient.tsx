'use client';

import { useState } from "react";
import { ImageHandler } from "./imageHandler";
import { Task } from "./task";

export const WebClient = () => {
    const[task,setTask] = useState("");
    return (
        <div className="flex flex-col items-center">
            <Task className="mt-10" task={task} setTask={setTask}/>
            <ImageHandler task={task}/>
        </div>
    )
}