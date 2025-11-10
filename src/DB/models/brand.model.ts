import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';
@Schema({timestamps: true,toJSON: { virtuals: true },toObject: { virtuals: true },strictQuery: true,})
export class Brand {
    @Prop({ required: true, type: String, min: 3, trim: true,unique:true })
    name: string; 

    @Prop({ required: true, type: String, min: 3, trim: true })
    slogan: string;

    @Prop({ required: true, type: String })
    image: string;

    @Prop({ type: String, default : function(){return slugify(this.name,{replacement:"-",lower:true,trim:true})} })
    slug: string;

    @Prop({type:Types.ObjectId,ref:"User",required:true})
    createdBy:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId

    @Prop({type:Date})
    deletedAt:Date

    @Prop({type:Date})
    restoreAt:Date

}

export type BrandDocument = HydratedDocument<Brand>
export const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.pre(["updateOne","findOneAndUpdate"],async function(next){
    const update = this.getUpdate() as UpdateQuery<Brand>
    if(update.name){
        update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
    next()
})

export const BrandModel = MongooseModule.forFeature([{ name: Brand.name,schema:BrandSchema}])