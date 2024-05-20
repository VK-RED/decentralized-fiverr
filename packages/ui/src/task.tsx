'use client';

import {DivProps} from "@repo/common/types";

export const Task = ({className}:DivProps) => {
    return (
        <div className={`flex flex-col items-center space-y-5 w-[700px] text-center py-2 ${className}`}>
            <div className="text-2xl">
                Create a Task
            </div>
            <div className="w-full">
                <div>
                    Enter Task Name
                </div>
                <input className="mt-2 border border-gray-400 w-full rounded p-1 max-h-7" 
                        type="text" 
                        placeholder="Task title"
                />
            </div>
        </div>
    )
}