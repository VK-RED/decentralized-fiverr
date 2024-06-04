"use client";

import { selector } from "recoil";
import { workerVerifiedAtom } from "./atoms";

export const workerVerifiedSelector = selector({
    key:'workerVerifiedSelector',
    get:({get})=>{
        return get(workerVerifiedAtom);
    }
})