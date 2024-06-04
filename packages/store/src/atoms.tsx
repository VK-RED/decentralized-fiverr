"use client"

import { GetBalance  } from "@repo/common/types";
import { atom } from "recoil";

export const workerVerifiedAtom = atom({
    key:'workerVerifiedAtom',
    default:false,
})


export const workerBalAtom = atom<GetBalance>({
    key:'workerBalanceAtom',
    default:{
        availableAmount:0,
        lockedAmount:0
    }
})