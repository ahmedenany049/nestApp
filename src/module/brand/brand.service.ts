import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { createBrandDto, queryDto, updateBrandDto } from './brand.dto';
import { BrandRepo, userDocument } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
    constructor(
        private readonly brandRepo:BrandRepo,
        private readonly s3Service:S3service,
    ){}
    async createBrand (
        brandDto:createBrandDto,
        user:userDocument,
        file:Express.Multer.File
    ){
        const {name, slogan}=brandDto
        const brandExist = await this.brandRepo.findOne({filter:{name}})
        if(brandExist){
            throw new BadRequestException("name already exist")
        }
        const url = await this.s3Service.uploadFile({
            path:"brands",
            file,
        })
        const brand = await this.brandRepo.create({
            name,
            slogan,
            image:url,
            createdBy:user._id
        })
        if(!brand){
            await this.s3Service.deleteFile({
                Key:url
            })
            throw new InternalServerErrorException("faild to create brand")
        }
        return brand
    }
//==================================================================
    async updateBrand(
        id:Types.ObjectId,
        brandDto:updateBrandDto,
        user:userDocument,
    ){
        const {name,slogan} = brandDto
        const brand = await this.brandRepo.findOne({filter:{_id:id,createdBy:user._id}})
        if(!brand){
            throw new NotFoundException("brand not found")
        }

        if(name&&await this.brandRepo.findOne({filter:{name}})){
            throw new ConflictException("brand already exist")
        }
        const newBrand =await this.brandRepo.findOneAndUpdate({_id:id,createdBy:user._id},{name,slogan})
        return newBrand
    }


    async updateBrandImage(
        id:Types.ObjectId,
        file:Express.Multer.File,
        user:userDocument,
    ){
        const brand = await this.brandRepo.findOne({filter:{_id:id,createdBy:user._id}})
        if(!brand){
            throw new NotFoundException("brand not found")
        }

        const url = await this.s3Service.uploadFile({
            path:"brands",
            file
        })
        const newBrand =await this.brandRepo.findOneAndUpdate({_id:id},{image:url})
        if(!brand){
            await this.s3Service.deleteFile({
                Key:url
            })
            throw new InternalServerErrorException("faild to create brand")
        }
        await this.s3Service.deleteFile({
            Key:brand.image
        })
        return newBrand
    }

    async freezBrand(id:Types.ObjectId,user:userDocument){
        const brand =  await this.brandRepo.findOneAndUpdate({ _id: id },{ deletedAt: new Date(),updatedBy:user._id },{ new: true })
        if(!brand){
            throw new NotFoundException("brand not found")
        }
        return brand 
    }     
//==============================================================
    async restoeBrand(id:Types.ObjectId,user:userDocument){
        const brand =  await this.brandRepo.findOneAndUpdate({ _id: id ,deletedAt:{$exists:true},paranoid:false},{ $unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id },{ new: true })
        if(!brand){
            throw new NotFoundException("brand not found or restored")
        }
        return brand
    }    
//==============================================================
    async delete(id: Types.ObjectId) {
        const brand = await this.brandRepo.findOne({
            filter: { _id: id, deletedAt: { $exists: true } }
        });
        
        if (!brand) {
            throw new NotFoundException("Brand not found or already restored");
        }
        await this.s3Service.deleteFile({
            Key: brand.image, 
        });
        const deletedBrand = await this.brandRepo.deleteOne({ _id: id, paranoid: false });
        return deletedBrand;
    }
    //==================================================================
    async getAllBrands(query:queryDto){
        const {page=1,limit=2,search}=query
        const {currentPage,countDoc,totalPages,result} = await this.brandRepo.paginate({filter:{
            ...(search?{$or:[{name:{$regex:search,$optins:"i"}},{slogan:search,$options:"i"}]}:{})
        },query:{page,limit}})
        return {currentPage,countDoc,totalPages,result}
    }
}
    


