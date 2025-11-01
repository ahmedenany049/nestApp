import { EventEmitter } from "stream"
import { sendEmail } from "../email/sendEmail"
import { emailTemplate } from "../email/email.temp"
import { OtpEnum } from "src/common/enums"

export const eventEmitter = new EventEmitter()

eventEmitter.on(OtpEnum.CONFIRM_EMAIL,async(data)=>{
    const{email,otp}=data
    await sendEmail({to:email,subject:OtpEnum.CONFIRM_EMAIL,html:emailTemplate(otp ,"Email Confirmation")})
})

eventEmitter.on(OtpEnum.FORGET_PASSWORD,async(data)=>{
    const{email,otp}=data
    await sendEmail({to:email,subject:OtpEnum.FORGET_PASSWORD,html:emailTemplate(otp ,"forget password")})
})
