import { Model } from "mongoose";
import { User, userDocument } from "../models";
import { DBrepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserRepo extends DBrepo<userDocument>{
    constructor(@InjectModel(User.name) protected override readonly model: Model<userDocument>){
        super(model)
    }
}