import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {db} from "@repo/db/src";
import {s3} from "@repo/aws/s3";
import { generateRandomString } from '../../utils';

const bucket = process.env.AWS_BUCKET_NAME as string;

export const userRouter = Router();

const generatePresignedUrl = async()=>{
    const randomString = generateRandomString();
    const params = {
        Bucket: bucket,
        Key: `/${randomString}/image.png`,
        Expires: 60 * 5,
    };
    const url = s3.getSignedUrl('putObject', params);
    return url;
}

userRouter.get("/presignedUrl",async (req,res)=>{
    // TODO : MAKE THIS AS AN AUTH GET THE REQ.ID FROM IT
    try {
        const url = await generatePresignedUrl();
        return res.json({url});
    } catch (error) {
        console.log("Error in Generating Presigned Url --------")
        console.error(error);
        throw new Error("Error in Generating Presigned Url");
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