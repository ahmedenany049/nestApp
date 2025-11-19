import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Coupon } from "../models";
import { DBrepo } from "./db.repo";
import { Model } from "mongoose";

@Injectable()
export class CouponRepo extends DBrepo<Coupon>{
    constructor(@InjectModel(Coupon.name) protected override readonly model: Model<Coupon>){
        super(model)
    }
}