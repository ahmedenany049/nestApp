import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { userDocument } from "src/DB";
import { TokenTypeEnum } from "../enums";

export interface UserWithRrequest extends Request{
    user:userDocument,
    decoded:JwtPayload,
    typeToken?:TokenTypeEnum
}