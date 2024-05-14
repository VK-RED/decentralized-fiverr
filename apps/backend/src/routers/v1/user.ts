import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {db} from "@repo/db/src";
import {s3} from "@repo/aws/s3";
import { generateRandomString } from '../../utils';
import { auth } from '../../middleware';

const bucket = process.env.AWS_BUCKET_NAME as string;

export const userRouter = Router();

const generatePresignedUrl = async(userId:string)=>{
    const randomString = generateRandomString();
    const params = {
        Bucket: bucket,
        Key: `${userId}/${randomString}/image.png`,
        Expires: 60 * 5,
    };
    const url = s3.getSignedUrl('putObject', params);
    return url;
}

userRouter.get("/presignedUrl",auth,async (req,res)=>{
    
    try {
        const userId:string = req.body.userId;
        if(!userId){
            throw new Error("Can't find the userId");
        }
        const url = await generatePresignedUrl(userId);
        return res.json({url});
    } catch (error) {
        console.error(error);
        return res.json({message:"Error in Generating Presigned URL !"});
    }
    
})

userRouter.post("/signin",async(req:Request,res:Response)=>{
    const WalletAddress = "HL3WVRERVREV8REER75VER6"
    const user = await db.user.upsert({
        where:{
            address:WalletAddress
        },
        update:{},
        create:{
            address:WalletAddress,
        }
    })
    console.log(user);
    const jwtSecret = process.env.JWT_SECRET as string;
    const token = jwt.sign({address:user.address},jwtSecret,{expiresIn:'24h'});
    return res.json({token});
})