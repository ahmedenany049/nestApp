import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart } from "../models";
import { DBrepo } from "./db.repo";
import { Model } from "mongoose";

@Injectable()
export class CartRepo extends DBrepo<Cart>{
    constructor(@InjectModel(Cart.name) protected override readonly model: Model<Cart>){
        super(model)
    }
}