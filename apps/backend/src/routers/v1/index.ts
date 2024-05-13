import { Router } from "express";
import { userRouter } from "./user";
import { workerRouter } from "./worker";

export const v1router  = Router();

v1router.use("/user",userRouter);
v1router.use("/worker",workerRouter);