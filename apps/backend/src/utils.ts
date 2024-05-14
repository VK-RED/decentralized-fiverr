export const generateRandomString = ()=>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = "";

    const limit = 6;
    for(let i = 0; i < limit; i++){
        const pos = Math.floor(Math.random()*characters.length);
        result+= characters.charAt(pos);
    }
    return result;
}