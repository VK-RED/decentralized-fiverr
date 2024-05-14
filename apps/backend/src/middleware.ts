import { db } from '@repo/db/src';
import {  Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const auth = async(req:Request,res:Response,next:NextFunction) => {
    const secret = process.env.JWT_SECRET as string;
    const header = req.headers["authorization"];
    if(!header){
        return res.json({message:"Header not found !! Kindly Signin"});
    }
    const token = header.split(" ")[1];
    if(!token){
        return res.json({message:"Token not found !! Kindly Signin"});
    }
    
    try {
        const {payload} = jwt.verify(token,secret,{complete:true});
        //@ts-ignore
        const address = payload.address;
        const user = await db.user.findFirst({where:{address}});
        req.body.userId = user?.id;
        next();
    } catch (error) {
        console.log("Error in Middleware");
        console.error(error);
        return res.json({message:"Enter Valid Token !"});
    }
}