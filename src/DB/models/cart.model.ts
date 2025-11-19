import { HydratedDocument, Types, UpdateQuery } from 'mongoose';
import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class CartProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;
  @Prop({ type: Number, required:true })
  quantity: number;

  @Prop({ type: Number, required:true })
  finalPrice: number;
}

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  strictQuery: true,
})
export class Cart {
    @Prop({type:[CartProduct]})
    products:CartProduct[]

    @Prop({type:Number})
    subTotal:number

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Date })
  deletedAt: Date;

  @Prop({ type: Date })
  restoreAt: Date;
}

export type CartDocument = HydratedDocument<Cart>;
export const CartSchema = SchemaFactory.createForClass(Cart);
CartSchema.pre("save",function(next){
    this.subTotal = this.products.reduce((total,product)=>total + (product.quantity * product.finalPrice),0)
    next()
});

CartSchema.pre(["findOne","find","findOneAndUpdate"],async function (next){
    const {paranoid,...res}= this.getQuery()
    if(paranoid === false){
        this.setQuery({...res,deletedAt:{$exists:true}})
    }else{
        this.setQuery({...res,deletedAt:{$exists:false}})
    }
    next()
})

export const CartModel = MongooseModule.forFeature([
  { name: Cart.name, schema: CartSchema },
]);
