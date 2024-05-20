import {z} from "@repo/zod/src";
import { postTaskSchema } from "./schema";
import { submissionSchema } from "./schema";
export type PostTask = z.infer<typeof postTaskSchema>;

export type TaskOptions = Record<number,{count:number,position:number,img_url:string}>;

export interface ResultMessage{
    message:string;
}

export interface GetTask{
    allOptions:TaskOptions,
}

export type SubmissionInput = z.infer<typeof submissionSchema>;

export interface SubmissionResult{
    amount:string
}

export interface GetBalance{
    availableAmount:number,
    lockedAmount:number,
}

export interface DivProps{
    className?:string,
}