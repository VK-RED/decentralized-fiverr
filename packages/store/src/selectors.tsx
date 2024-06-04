import { selector } from "recoil";
import { nextTaskAtom } from "./atoms";

export const nextTaskSelector = selector({
    key:"nextTaskSelector",
    get:({get})=>{
        const task = get(nextTaskAtom);
        return task;
    }
})

