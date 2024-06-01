import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {db} from "@repo/db/src";
import {s3} from "@repo/aws/s3";
import { generateRandomString } from '../../utils';
import { auth } from '../../middleware';
import { ZodError } from 'zod';
import {postTaskSchema} from "@repo/common/schema";
import {TaskOptions,ResultMessage,GetTask, SignIn} from "@repo/common/types";
import {TOTAL_DECIMAL} from "@repo/common/messages";
import { PublicKey } from "@solana/web3.js";

import nacl from "tweetnacl";

const bucket = process.env.AWS_BUCKET_NAME as string;

export const userRouter = Router();

const generatePresignedUrl = async(userId:string)=>{
    const randomString = generateRandomString();
    const key = `${userId}/${randomString}/image.png`
    const params = {
        Bucket: bucket,
        Key: key,
        Expires: 60 * 5,
    };
    const url = s3.getSignedUrl('putObject', params);
    return {url,key};
}

userRouter.get("/presignedUrl",auth,async (req,res)=>{
    
    try {
        const userId:string = req.body.userId;
        if(!userId){
            throw new Error("Can't find the userId");
        }
        const {url,key} = await generatePresignedUrl(userId);
        return res.json({url,key});
    } catch (error) {
        console.error(error);
        return res.json({message:"Error in Generating Presigned URL !"});
    }
    
})

userRouter.post("/signin",async(req:Request,res:Response)=>{
    const {publicKey,signature}:SignIn = req.body;
    if(!publicKey || !signature){
        return res.json({message:"PUBLICKEY OR SIGNATURE MISSING !!"})
    }

    //convert signature to u8intarr
    const dataarr = Object.values(signature).map((v)=>v)
    const signatureArr = Uint8Array.from(dataarr);
    console.log(signatureArr);

    //convert message to u8int
    const message = "TUDUM";
    const messageBytes = new TextEncoder().encode(message);

    const result = nacl.sign.detached.verify(
        messageBytes,
        signatureArr,
        new PublicKey(publicKey).toBytes()
    );
    
    console.log(result);

    if(!result){
        return res.json({message:"YOU DON'T HAVE PERMISSIONS !"})
    }

    const user = await db.user.upsert({
        where:{
            address:publicKey
        },
        update:{},
        create:{
            address:publicKey,
        }
    })
    console.log(user);
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign({address:user.address},jwtSecret,{expiresIn:'24h'});
    return res.json({token});
})

userRouter.post("/task",auth,async(req,res)=>{
    try {
        const body = postTaskSchema.parse(req.body);
        const userId = req.body.userId as string;

        //TODO: VALIDATE THE SIGNATURE FROM BODY

        // FOR NOW ASSUMING SIGNATURE IS VALID;

        //CREATING THE TASK (You will be getting the amount in SOL -> Convert to LAMPORT)

        const task = await db.task.create({
            data:{
                amount:body.amount*TOTAL_DECIMAL,
                signature:body.signature,
                title:body.title || "Select the Attractive Image",
                userId,
            },
            select:{
                id:true,
            }
        })

        //CREATING THE OPTIONS

        const promises = [];

        for(let i = 0; i < body.urls.length; i++){
            const url = body.urls[i] as string;
            const promise = db.option.create({
                data:{
                    img_url:url,
                    position:i+1,
                    taskId:task.id
                }
            })
            promises.push(promise);    
        }

        await Promise.all(promises);
        console.log(promises);
        return res.json({message:"Successfully created the task !!",taskId:task.id});

    } catch (error) {
        if(error instanceof ZodError){
            const message = error.issues[0]?.message
            return res.json({message});
        }
        else{
            console.error(error);
            return res.json({message:"ERROR IN CREATING A TASK"})
        }
    }
    
})

userRouter.get("/task/:id",auth,async(req:Request<{id:string}>,res) :
(Promise<Response<ResultMessage|GetTask>>) =>
{
    const userId = req.body.userId;
    const taskId = req.params.id;
    
    // Get the task from db

    const task = await db.task.findFirst({
        where:{
            id:taskId,
            userId
        },
        include:{
            submissions:{
                select:{
                    option_id:true,
                }
            },
            options:true,
        }
    });

    if(!task){
        return res.json({message:"Enter Valid Task Id"});
    }

    //Find out which option is performing better, To do that maintain a counterMap

    const counterMap:TaskOptions = {};

    //Traverse on the options to initiate CounterMap
    
    const options = task.options;
    options.map(({id,img_url,position})=>{
        counterMap[id] = {count:0,img_url,position};
    })
    
    //Traverse on the submissions to increase the count;

    const submissions = task.submissions;

    submissions.map((s)=>{
        const value = counterMap[s.option_id];
        if(value){
            counterMap[s.option_id] = {...value,count:value.count+1};
        }
    }) 

    console.log("Counter map : ",counterMap);
    
    return res.json({allOptions:counterMap,title:task.title});
})