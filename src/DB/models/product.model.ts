import { HydratedDocument, Types, UpdateQuery } from "mongoose";

import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import slugify from 'slugify';
@Schema({timestamps: true,toJSON: { virtuals: true },toObject: { virtuals: true },strictQuery: true,})
export class Product {
    @Prop({ required: true, type: String, min: 3, trim: true })
    name: string; 

    @Prop({ required: true, type: String, min: 3, trim: true })
    description: string;

    @Prop({ required: true, type: String })
    mainImage: string;

    @Prop({  type: [String] })
    subImages: string[];

    @Prop({ required: true, type: Number })
    price: number;

    @Prop({ type: Number,min:1,max:100})
    discount: number;

    @Prop({ type: Number,min:1})
    quantity: number;

    @Prop({ type: Number})
    stock: number;

    @Prop({ type: Number})
    reteNum: number;

    @Prop({ type: Number})
    rateAvg: string;

    @Prop({ type: String, default : function(){return slugify(this.name,{replacement:"-",lower:true,trim:true})} })
    slug: string;

    @Prop({type:Types.ObjectId,ref:"User",required:true})
    createdBy:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:"Category",required:true})
    category:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:"Brand",required:true})
    brand:Types.ObjectId

    @Prop({type:Types.ObjectId,ref:"User"})
    updatedBy:Types.ObjectId

    @Prop({type:Date})
    deletedAt:Date

    @Prop({type:Date})
    restoreAt:Date

}

export type ProductDocument = HydratedDocument<Product>
export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.pre(["updateOne","findOneAndUpdate"],async function(next){
    const update = this.getUpdate() as UpdateQuery<Product>
    if(update.name){
        update.slug = slugify(update.name,{replacement:"-",lower:true,trim:true})
    }
    next()
})

ProductSchema.pre(["findOne","find","findOneAndUpdate"],async function (next){
    const {paranoid,...res}= this.getQuery()
    if(paranoid === false){
        this.setQuery({...res,deletedAt:{$exists:true}})
    }else{
        this.setQuery({...res,deletedAt:{$exists:false}})
    }
    next()
})

export const ProductModel = MongooseModule.forFeature([{ name: Product.name,schema:ProductSchema}])