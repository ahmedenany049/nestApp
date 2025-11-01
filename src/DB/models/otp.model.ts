import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OtpEnum } from "src/common/enums";
import { Hash } from "src/common/helpers/hash/hash";
import { eventEmitter } from "src/common/service";

@Schema({timestamps:true})
export class OTP {
    @Prop({required:true,type:String,trim:true})
    code:string
    @Prop({required:true,type:Types.ObjectId,ref:"User"})
    createdBy:Types.ObjectId
    @Prop({type:String,required:true,enum:OtpEnum})
    type:OtpEnum
    @Prop({required:true,type:Date})
    expireAt:Date
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
export type OtpDocument = HydratedDocument<OTP>
OtpSchema.index({expireAt:1},{expireAfterSeconds:0})
OtpSchema.pre("save",async function(this:OtpDocument&{is_new:boolean,plainCode:string},next){
    if(this.isModified("code")){
        this.plainCode = this.code
        this.is_new = this.isNew
        this.code = await Hash({plainText:this.code})
        await this.populate([{
            path:"createdBy",
            select:"email"
        }])
    }
    next()
})
OtpSchema.post("save",async function(doc,next){
    const that = this as OtpDocument &{is_new:boolean,plainCode:string}
    if(that.is_new){
        eventEmitter.emit(doc.type,{otp:that.plainCode,email:(doc.createdBy as any).email})
    }
    next()
})
export const OtpModel = MongooseModule.forFeature([{ name: OTP.name,schema:OtpSchema}])
