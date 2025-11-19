import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "../models";
import { DBrepo } from "./db.repo";
import { Model } from "mongoose";

@Injectable()
export class ProductRepo extends DBrepo<Product>{
    constructor(@InjectModel(Product.name) protected override readonly model: Model<Product>){
        super(model)
    }
}