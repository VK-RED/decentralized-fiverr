import { PrismaClient } from "@prisma/client";

declare global{
    var prisma: PrismaClient | null
}

const generatePrismaClient = () => {
    if(process.env.NODE_ENVIRONMENT === 'development'){
        if(!globalThis.prisma){
            globalThis.prisma = new PrismaClient();
            console.log("Prisma Client Initialized");
        }
        return globalThis.prisma;
    }
    else{
        console.log(process.env.NODE_ENVIRONMENT);
        console.log("Prisma Client Initialied in Production");
        return new PrismaClient();
    }
}

export const db = generatePrismaClient();
// export const db = new PrismaClient()