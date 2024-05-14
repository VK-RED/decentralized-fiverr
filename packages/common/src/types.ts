import {z} from "@repo/zod/src";
import { postTaskSchema } from "./schema";

export type PostTask = z.infer<typeof postTaskSchema>;