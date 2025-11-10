import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { DBrepo } from "./db.repo";
import { Model } from "mongoose";
import { category } from "../models";

@Injectable()
export class categoryRepo extends DBrepo<category>{
    constructor(@InjectModel(category.name) protected override readonly model: Model<category>){
        super(model)
    }
}