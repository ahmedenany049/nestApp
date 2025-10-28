import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { UserGender, UserProvider, UserRole } from "src/common/enums";
import type{ OtpDocument } from "./otp.model";
import { Hash } from "src/common/helpers/hash/hash";

@Schema({timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true},strictQuery:true})
export class User{
    @Prop({type:String,required:true,min:3,trim:true})
    fName:string;
    @Prop({type:String,required:true,min:3,trim:true})
    lName:string;
    @Virtual({
        get:function(){
            return `${this.fName}${this.lName}`
        },
        set:function(value:string){
            const [fName,lName] = value.split(' ')
            this.fName = fName;
            this.lName = lName;
        }
    })
    userName:string
    @Prop()
    confirmed:Boolean
    @Prop({type:String,required:true,lowercase:true,trim:true})
    email:string;
    @Prop({type:String,required:true,min:6,trim:true})
    password:string;
    @Prop({type:String,required:true,min:18,trim:true})
    age:number;
    @Prop({type:String,enum:UserRole,default:UserRole.USER})
    role:UserRole;
    @Prop({type:String,enum:UserGender,default:UserGender.MALE})
    gender:UserGender;
    @Prop({type:String,enum:UserProvider,default:UserProvider.LOCAL})
    provider:UserProvider;
    @Prop({type:Date,default:Date.now})
    changeCredentialAt:Date

    @Virtual()
    otp:OtpDocument
}

export type userDocument = HydratedDocument<User>
export const userSchema = SchemaFactory.createForClass(User);
userSchema.virtual("otp",{
    ref:"OTP",
    localField:"_id",
    foreignField:"createdBy"
})
export const UserModel = MongooseModule.forFeatureAsync([{ name: User.name,useFactory:()=>{
    userSchema.pre("save",async function(next){
        if(this.isModified("password")){
            this.password= await Hash({plainText:this.password})
        }
        next()
    })
    return userSchema
}}])
