import { NextTaskType } from "@repo/common/types";
import { atom } from "recoil";


export const nextTaskAtom = atom<NextTaskType>({
    key:'nextTaskAtom',
    default:{
        title:"",
        options:[],
    }
})

