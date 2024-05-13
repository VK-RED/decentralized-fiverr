import express, { Request, Response } from 'express';

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/",(req:Request,res:Response)=>{
    console.log(req.body);
    return res.json({message:"Server working fine"});
})

app.listen(PORT,()=>{
    console.log(`Listening on the PORT: ${PORT}`);
})