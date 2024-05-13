import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {db} from "@repo/db/src";
export const userRouter = Router();

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