import { db } from '@repo/db/src';
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { workerAuth } from '../../middleware';
import { submissionSchema } from '@repo/common/schema';
import { ZodError } from 'zod';
import { getNextTask } from '../../db';
import { SignIn } from '@repo/common/types';
import nacl from 'tweetnacl';
import { Connection, Keypair, PublicKey, SystemProgram, Transaction, clusterApiUrl, sendAndConfirmTransaction } from '@solana/web3.js';
import {decode} from 'bs58';
export const workerRouter = Router();


workerRouter.post("/signin",async(req,res)=>{

    const {publicKey,signature}:SignIn = req.body;
    if(!publicKey || !signature){
        return res.json({message:"PUBLICKEY OR SIGNATURE MISSING !!"})
    }

    let dataarr;
    //convert signature to u8intarr
    if("data" in signature){
        dataarr = Object.values(signature.data).map((v)=>v)
    }
    else{
        dataarr = Object.values(signature).map((v)=>v)
    }

    const signatureArr = Uint8Array.from(dataarr);
    console.log(signatureArr);

    //convert message to u8int
    const message = "TUDUMWORKER";
    const messageBytes = new TextEncoder().encode(message);

    const result = nacl.sign.detached.verify(
        messageBytes,
        signatureArr,
        new PublicKey(publicKey).toBytes()
    );

    if(!result){
        return res.json({message:"YOU DON'T HAVE PERMISSIONS !"})
    }

    const workerSecret = process.env.WORKER_JWT_SECRET as string;

    const worker = await db.worker.upsert({
        where:{
            address:publicKey,
        },
        create:{
            address:publicKey,
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

        const result = await db.$transaction(async(tx)=>{
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
            
            return {amount:newSubmission.amount};
            
        })
        
        return res.json(result);
        

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

    const worker = await db.worker.findFirst({
        where:{
            id:workerId
        },
        select:{
            address:true,
        }
    })

    if(!worker){
        return res.json({message:"Cannot find the worker !!"});
    }

    const amount = await db.balance.findFirst({
        where:{
            workerId,
        },
        select:{
            available_amount:true,
        }
    });

    if(!amount || amount.available_amount === 0){
        return res.json({message:"Balance is empty !!"});
    }

    const recepient = worker.address; 
    const payoutIns = SystemProgram.transfer({
        fromPubkey:new PublicKey(process.env.NEXT_PUBLIC_MASTER_WALLET as string),
        toPubkey: new PublicKey(recepient),
        lamports:amount.available_amount
    })
    const transaction = new Transaction().add(payoutIns);
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const privateKey = process.env.MASTER_WALLET_PRIVATE_ADDRESS as string
    const signers = Keypair.fromSecretKey(decode(privateKey));

    let TxnId;
    try {
        TxnId = await sendAndConfirmTransaction(connection,transaction,[signers]);
        return res.json({
            status:"Processed the Payouts",
            amount: amount.available_amount,
        })
    } catch (error) {
        console.log(error);
        return res.json({message:"Error in Transferring Payouts !!"});
    }
    

    //For now commenting this .. 

    // await db.$transaction(async tx => {

    //     //Move this amount from available to locked and create a Payout

    //     await tx.balance.update({
    //         where:{
    //             workerId,
    //         },
    //         data:{
    //             available_amount:{
    //                 decrement:amount.available_amount,
    //             },
    //             locked_amount:{
    //                 increment: amount.available_amount,
    //             }
    //         }
    //     })

    //     await tx.payout.create({
    //         data:{
    //             amount:amount.available_amount,
    //             status:"Processing",
    //             workerId,
    //             signature:TxnId

    //         }
    //     })


    // })

    // // TODO : Send the transaction to Blockchain


    // return res.json({
    //     status:"Processing Payout",
    //     amount: amount.available_amount,
    // })

    
})