import { HydratedDocument, Types, UpdateQuery } from "mongoose";
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({timestamps: true,toJSON: { virtuals: true },toObject: { virtuals: true },strictQuery: true,})
export class Coupon {
    @Prop({ required: true, type: String, min: 3, trim: true,unique:true ,lowercase:true})
    code: string;
    
    @Prop({type:Number,required:true})
    amount:number

    @Prop({type:Date,required:true})
    fromDate:Date 

    @Prop({type:Date,required:true})
    toDate:Date

    @Prop({type:Types.ObjectId,ref:"User",required:true})
    createdBy:Types.ObjectId 

    @Prop({type:[{type:Types.ObjectId,ref:"User",required:true}]})
    usedBy:Types.ObjectId[]

    @Prop({type:Date})
    deletedAt:Date

    @Prop({type:Date})
    restoreAt:Date

}

export type CouponDocument = HydratedDocument<Coupon>
export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.pre(["findOne","find","findOneAndUpdate"],async function (next){
    const {paranoid,...res}= this.getQuery()
    if(paranoid === false){
        this.setQuery({...res,deletedAt:{$exists:true}})
    }else{
        this.setQuery({...res,deletedAt:{$exists:false}})
    }
    next()
})

export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name,schema:CouponSchema}])