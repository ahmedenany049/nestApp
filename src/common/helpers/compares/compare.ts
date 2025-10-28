import { compare } from "bcrypt"


export const Compare = async({plainText,hash}:{plainText:string,hash:string})=>{
    return await compare(plainText,hash)
}