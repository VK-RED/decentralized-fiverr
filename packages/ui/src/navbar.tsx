export const Navbar = ({className}:{className?:string}) => {
    return(
        <div className="w-screen border max-h-16 py-1 flex justify-between px-4 items-center">
            <div className="font-semibold text-xl font-sans cursor-pointer">
                TUDUM
            </div>
            <div className="text-sm cursor-pointer">
                CONNECT MY WALLET
            </div>
        </div>
    )
}