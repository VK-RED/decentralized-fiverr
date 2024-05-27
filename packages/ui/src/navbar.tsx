'use client';
import { BACKEND_URL, TOTAL_DECIMAL } from "@repo/common/messages";
import { GetBalance, ResultMessage } from "@repo/common/types";
import React, { useEffect, useState } from "react"

export const Navbar = ({children,isWorkerNav}:{children:React.ReactNode,isWorkerNav:boolean}) => {

    const [balance,setBalance] = useState<GetBalance>({availableAmount:0,lockedAmount:0});

    useEffect(()=>{
        if(isWorkerNav){
            getBalance();
        }
    },[])

    const getBalance = async()=>{
        const token = localStorage.getItem('token');
        const res = await fetch(`${BACKEND_URL}v1/worker/balance`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "authorization":"Bearer "+token
            }
        });
        const data:GetBalance|ResultMessage = await res.json();
        if("availableAmount" && "lockedAmount" in data){
            setBalance((p)=>({availableAmount:data.availableAmount,lockedAmount:data.lockedAmount}))
        }
        console.log();
    }   

    return(
        <div>
            <div className="w-screen border max-h-16 py-1 flex justify-between px-10 items-center">
                <div className="font-semibold text-xl font-sans cursor-pointer">
                    TUDUM
                </div>

                {/* TODO:IDEALLY SHOW THE BALANCE WHEN WALLET IS CONNECTED */}
               
                <div className="flex gap-x-4">
                    {
                        isWorkerNav &&
                        <div className="justify-center flex items-center gap-x-2">
                            <div>
                                {`SOL : ${balance.availableAmount/TOTAL_DECIMAL}`}
                            </div>
                            <div>
                                {`LOCKED SOL : ${balance.lockedAmount/TOTAL_DECIMAL}`}
                            </div>
                        </div>
                        
                    }
                    <div className="font-semibold cursor-pointer">
                        CONNECT MY WALLET
                    </div>
                </div>
            </div> 
            {children}
        </div>
       
    )
}