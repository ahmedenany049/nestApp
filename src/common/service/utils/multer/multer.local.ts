import { BadRequestException } from "@nestjs/common"
import { Request } from "express"
import multer from "multer"

export const multerLocal = ({fileTypes = []}:{fileTypes?:string[]})=>{
    return {
        storage:multer.diskStorage({
            destination:(req:Request, file:Express.Multer.File, cb:Function)=> {
                cb(null,"./upload")
            },
            filename:(req:Request, file:Express.Multer.File, cb:Function)=>{
                cb(null,Date.now()+"_"+file.originalname)
            }
        }),
        fileFilter:(req:Request, file:Express.Multer.File, cb:Function)=>{
            if(fileTypes.includes(file.mimetype)){
                cb(null,true)
            }else {
                cb(new BadRequestException("invalid file type"))
            }
        },
        limits:{
            fileSize : 1024*1024*5
        }
    }
}