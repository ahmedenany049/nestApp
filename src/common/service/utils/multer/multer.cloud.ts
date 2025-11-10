import multer from "multer"
import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import { storageEnum } from "src/common/enums"
import { fileValidation } from "./multer.fileValidation"
import os from "os"

export const multerCloud = ({
    fileTypes=fileValidation.image,
    storeType=storageEnum.cloud,
}:{
    fileTypes?:string[],
    storeType?:storageEnum,
})=>{
    return {
        storage : storeType===storageEnum.cloud? multer.memoryStorage():multer.diskStorage({
            destination:os.tmpdir(),
            filename(req:Request,file:Express.Multer.File,cb){
                cb(null,`${Date.now()}_${file.originalname}`)
            }
        }),
        fileFilter : (req:Request,file:Express.Multer.File,cb:Function)=>{
            if(!fileTypes.includes(file.mimetype)){
            cb(new BadRequestException("invalid file type"))
        }else{
            cb(null,true)
        }
    }}
}