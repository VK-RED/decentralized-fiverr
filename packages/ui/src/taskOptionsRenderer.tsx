import { TaskOptions } from "@repo/common/types"

export const TaskOptionsRenderer = ({className,taskOptions,title}:{className?:string,taskOptions?:TaskOptions,title:string})=>{
    return (
        <div className={`my-5 flex flex-col items-center gap-y-3 ${className}`}>

            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                {title}
            </h1>
            <div className="mt-10 flex justify-center gap-x-2 max-w-screen-2xl px-5">
                {   taskOptions && 
                    Object.keys(taskOptions).map((k)=>{
                        const taskKey = Number(k);
                        const value = taskOptions[taskKey];
                        if(!value){
                            return null;
                        }
                        return (
                            <div className="flex flex-col items-center">
                                <img className="h-40 w-70" src={value.img_url} />
                                <div className="mt-5">
                                    {value.count}
                                </div>
                            </div>
                        )
                    })
                }
            </div>

            
        </div>
    )
}