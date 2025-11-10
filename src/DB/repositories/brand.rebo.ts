import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Brand } from "../models";
import { DBrepo } from "./db.repo";
import { Model } from "mongoose";

@Injectable()
export class BrandRepo extends DBrepo<Brand>{
    constructor(@InjectModel(Brand.name) protected override readonly model: Model<Brand>){
        super(model)
    }
}