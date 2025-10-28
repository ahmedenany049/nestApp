import { hash } from "bcrypt"

export const Hash =async ({plainText,saltRound=Number(process.env.SALT_ROUNDS)}:{plainText:string,saltRound?:number})=>{
    return await hash(plainText,saltRound)
}