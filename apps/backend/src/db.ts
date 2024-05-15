import { db } from "@repo/db/src";

export const getNextTask = async (workerId:string) => {
    const nextTask = await db.task.findFirst({
        where:{
         submissions:{
             none:{
                 workerId
             }
         },
         completed:false
        },
        include:{
         options:true,
         submissions:true,
        },
    });

    return nextTask;
}