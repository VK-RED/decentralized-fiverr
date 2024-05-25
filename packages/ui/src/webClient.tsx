'use client';

import { ImageHandler } from "./imageHandler";
import { Task } from "./task";

export const WebClient = () => {
    return (
        <div className="flex flex-col items-center">
            <Task className="mt-10"/>
            <ImageHandler/>
        </div>
    )
}