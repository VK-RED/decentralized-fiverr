import { db } from '@repo/db/src';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

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

    const token = jwt.sign({workerId:worker.id},workerSecret,{expiresIn:'24h'});
    return res.json({token});
})