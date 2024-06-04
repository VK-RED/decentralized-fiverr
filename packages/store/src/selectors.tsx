"use client";

import { selector } from "recoil";
import { workerBalAtom, workerVerifiedAtom } from "./atoms";

export const workerVerifiedSelector = selector({
    key:'workerVerifiedSelector',
    get:({get})=>{
        return get(workerVerifiedAtom);
    }
})

export const workerBalanceSelector = selector({
    key:'workerBalanceSelector',
    get:({get})=>{
        return get(workerBalAtom);
    }
})