import { db } from '@repo/db/src';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { workerAuth } from '../../middleware';
import { submissionSchema } from '@repo/common/schema';
import { ZodError } from 'zod';
import { getNextTask } from '../../db';

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


workerRouter.get("/nextTask",workerAuth,async(req,res)=>{
    const workerId = req.body.workerId as string;

    //Find a task where the relational submission table should not contain the workerId
    console.log(workerId);
    const nextTask = await getNextTask(workerId);

    if(!nextTask){
        return res.json({
            message:"No Works Left for you !!"
        })
    }

    
    const task = {title:nextTask.title,options:nextTask.options};
    return res.json({task});
})


workerRouter.post("/submission",workerAuth,async(req,res)=>{
    const workerId = req.body.workerId as string;

    try {

        const{optionId,taskId} = submissionSchema.parse(req.body);

        //If the task is completed or does n't exist or not the specified task then throw an error
        const task = await getNextTask(workerId);
        
        if(!task || taskId !== task.id){
            return res.json({message:"Enter valid TaskId"});
        }

        // TODO: FIX A LIMIT && IF THAT'S REACHED THEN DON'T ALLOW THE USER
        if(task.completed){
            return res.json({message:"The Task is not Open Anymore !"});
        }

        //Check if the user already submitted a response
        const submission = task.submissions.find((sub)=>sub.workerId === workerId);

        if(submission){
            return res.json({message:"Already Submitted the response !!"})
        }

        // TODO : FIX THE TOTAL SUBMISSIONS

        const limit = 100;
        const bounty = task.amount/limit; // The bounty will be in lamports

        await db.$transaction(async(tx)=>{
            const newSubmission = await tx.submission.create({
                data:{
                    taskId,
                    option_id:Number(optionId),
                    workerId,
                    amount:bounty,
                }
            });

            const existingBalance = await tx.balance.findFirst({
                where:{
                    workerId,
                },
                select:{
                    available_amount:true,
                }
            })

            const availablePay = existingBalance?.available_amount || 0;

            await tx.balance.upsert({
                where:{
                    workerId
                },
                create:{
                    workerId,
                    available_amount:bounty,
                    locked_amount:0,
                },
                update:{
                    available_amount:bounty + availablePay,
                }
            })
            
            return res.json({amount:newSubmission.amount})
            
        })
        
        return res.json({message:"Error in Submitting the task"})
        

    } catch (error) {
        if(error instanceof ZodError){
            const message = error.issues[0]?.message
            return res.json({message});
        }
        else{
            console.error(error);
            return res.json({message:"Error in Submitting the task !!"})
        }
    }

})

workerRouter.get("/balance",workerAuth,async(req,res)=>{
    const workerId = req.body.workerId as string;
    const balance = await db.balance.findFirst({
        where:{
            workerId,
        }
    });

    if(!balance){
        return res.json({message:"No balance found for the workerId !!"});
    }

    return res.json({
        availableAmount:balance.available_amount,
        lockedAmount:balance.locked_amount,
    });
})

workerRouter.post("/payout",workerAuth,async(req,res)=>{
    const workerId = req.body.workerId as string;

    /* 
        Get the amount in SOL
        Check if that balance is available and above the threshold
        if not return appropriate message

        else move the money from available to locked
        and notify the user
    */
})