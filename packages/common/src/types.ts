import {z} from "@repo/zod/src";
import { postTaskSchema } from "./schema";

export type PostTask = z.infer<typeof postTaskSchema>;

export type TaskOptions = Record<number,{count:number,position:number,img_url:string}>;

export interface ResultMessage{
    message:string;
}

export interface GetTask{
    allOptions:TaskOptions,
}
