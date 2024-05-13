import express, { Request, Response } from 'express';
import { v1router } from './routers/v1';

const app = express();
const PORT = 8000;

app.use(express.json());

app.use("/v1",v1router);

app.get("/",(req:Request,res:Response)=>{
    console.log(req.body);
    return res.json({message:"Server working fine"});
})

app.listen(PORT,()=>{
    console.log(`Listening on the PORT: ${PORT}`);
})