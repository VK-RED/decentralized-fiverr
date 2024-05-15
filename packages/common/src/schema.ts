import {z} from "@repo/zod/src";

export const postTaskSchema = z.object({
    title : z.string().min(1).max(50).nullable(),
    signature: z.string(),
    amount: z.string(),
    urls: z.string().array(),
})

export const submissionSchema = z.object({
    optionId : z.string(),
    taskId: z.string(),
})