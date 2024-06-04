import { NextTaskType } from "@repo/common/types";
import { atom } from "recoil";

export const workerVerifiedAtom = atom({
    key:'workerVerifiedAtom',
    default:false,
})