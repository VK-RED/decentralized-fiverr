export const NextTaskOpts = ({className,imgUrl}:{className?:string,imgUrl:string}) =>{

    return (
        <div className={` ${className}`}>
            <img className="w-70 h-40" src={imgUrl}/>
        </div>  
    )
}