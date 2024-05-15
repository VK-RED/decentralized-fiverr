import { db } from '@repo/db/src';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { workerAuth } from '../../middleware';

export const workerRouter = Router();


workerRouter.post("/signin",async(req,res)=>{

    const workerSecret = process.env.WORKER_JWT_SECRET as string;
    
    //TODO : FIX THE WALLETADDRESS LATER;

    const WalletAddress = "JKN3RJKB13JKJ134K";

    const worker = await db.worker.upsert({
        where:{
            address:WalletAddress,
        },
        create:{
            address:WalletAddress,
        },
        update:{}
    });

    const token = jwt.sign({address:worker.address},workerSecret,{expiresIn:'24h'});
    return res.json({token});
})

// TODO: Test this route heavily once the submitTask is completed
workerRouter.get("/nextTask",workerAuth,async(req,res)=>{
    const workerId = req.body.workerId as string;

    //Find a task where the relational submission table should not contain the workerId
    console.log(workerId);
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
       },
    });

    if(!nextTask){
        return res.json({
            message:"No Works Left for you !!"
        })
    }

    
    const task = {title:nextTask.title,options:nextTask.options};
    return res.json({task});
})