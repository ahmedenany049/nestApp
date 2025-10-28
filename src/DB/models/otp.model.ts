import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { OtpEnum } from "src/common/enums";

@Schema({timestamps:true})
export class OTP {
    @Prop({required:true,type:String,trim:true})
    code:string
    @Prop({required:true,type:Types.ObjectId,ref:"User"})
    createdBt:Types.ObjectId
    @Prop({type:String,required:true,enum:OtpEnum})
    type:OtpEnum
    @Prop({required:true,type:Date})
    expireAt:Date
}

export const OtpSchema = SchemaFactory.createForClass(OTP);
export type OtpDocument = HydratedDocument<OTP>
OtpSchema.index({expireAt:1},{expireAfterSeconds:0})
export const OtpModel = MongooseModule.forFeature([{ name: OTP.name,schema:OtpSchema}])
