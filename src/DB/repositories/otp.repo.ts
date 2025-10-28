import { Model } from "mongoose";
import { OTP, } from "../models";
import { DBrepo } from "./db.repo";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OtpRepo extends DBrepo<OTP>{
    constructor(@InjectModel(OTP.name) protected override readonly model: Model<OTP>){
        super(model)
    }
}