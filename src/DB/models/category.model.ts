import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';
@Schema({timestamps: true,toJSON: { virtuals: true },toObject: { virtuals: true },strictQuery: true,})
export class category {
    @Prop({ required: true, type: String, min: 3, trim: true,unique:true })
    name: string; 

    @Prop({ required: true, type: String, min: 3, trim: true })
    slogan: string;

    @Prop({ required: true, type: String })
    image: string;

    @Prop({ type: String, default : function(){return slugify(this.name,{replacement:"-",lower:true,trim:true})} })
    slug: string;

    @Prop({type: String})
    assetFolderId:string

    @Prop({type:Types.ObjectId,ref:"User",required:true})
    createdBy:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:"Brand"})
    brands:Types.ObjectId[]

    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId

    @Prop({type:Date})
    deletedAt:Date

    @Prop({type:Date})
    restoreAt:Date

}

export type categoryDocument = HydratedDocument<category>
export const categorySchema = SchemaFactory.createForClass(category);
categorySchema.pre(["updateOne","findOneAndUpdate"],async function(next){
    const update = this.getUpdate() as UpdateQuery<category>
    if(update.name){
        update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
    next()
})

export const categoryModel = MongooseModule.forFeature([{ name: category.name,schema:categorySchema}])