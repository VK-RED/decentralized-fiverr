import {z} from "@repo/zod/src";
import { postTaskSchema } from "./schema";
import { submissionSchema } from "./schema";
import {SetStateAction,Dispatch} from 'react';
export type PostTask = z.infer<typeof postTaskSchema>;

export type TaskOptions = Record<number,{count:number,position:number,img_url:string}>;

export interface ResultMessage{
    message:string;
}

export interface GetTask{
    allOptions:TaskOptions,
    title:string
}

export type GetTaskResult = Partial<GetTask&ResultMessage>

export type SubmissionInput = z.infer<typeof submissionSchema>;

export interface SubmissionResult{
    amount?:number,
    message?:string,
}

export interface GetBalance{
    availableAmount:number,
    lockedAmount:number,
}

export interface DivProps{
    className?:string,
}

export interface UploadedFile{
    fileUri:string,
    file:File,
}

export interface ImageRendererProps extends DivProps{
    images?:UploadedFile[],
    task:string
}

export interface UploadImageProps extends DivProps{
    setImages: React.Dispatch<React.SetStateAction<UploadedFile[]|undefined>>
}

export interface ImageHandlerProps extends DivProps{
    task: string
}

export interface TaskProps extends ImageHandlerProps{
    setTask:Dispatch<SetStateAction<string>>
}

export interface PostTaskResult extends ResultMessage{
    taskId:string
}

export interface NextTaskType{
    title:string,
    options: {
        id: number;
        position: number;
        img_url: string;
        taskId: string;
    }[],
}

export interface NextTaskResult{
    message?:string;
    task?:NextTaskType,
}

export interface Payout{
    status?:string,
    amount?:number,
    message?:string,
}

export interface SignIn{
    publicKey?:string,
    signature?:{[key:string]:number}
}