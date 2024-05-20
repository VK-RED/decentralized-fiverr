'use client';
import React from "react"

export const Navbar = ({children}:{children:React.ReactNode}) => {
    return(
        <div>
            <div className="w-screen border max-h-16 py-1 flex justify-between px-10 items-center">
                <div className="font-semibold text-xl font-sans cursor-pointer">
                    TUDUM
                </div>
                <div className="text-sm cursor-pointer">
                    CONNECT MY WALLET
                </div>
            </div> 
            {children}
        </div>
       
    )
}