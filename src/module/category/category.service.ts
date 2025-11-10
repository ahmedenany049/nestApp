import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BrandRepo, categoryRepo, userDocument } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { Types } from 'mongoose';
import { createCategoryDto, updateCategoryDto, queryDto } from './category.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class categoryService {
    constructor(
        private readonly categoryRepo:categoryRepo,
        private readonly brandRepo:BrandRepo,
        private readonly s3Service:S3service,
    ){}
    async createcategory (
        categoryDto:createCategoryDto,
        user:userDocument,
        file:Express.Multer.File
    ){
        const {name, slogan,brands}=categoryDto
        const categoryExist = await this.categoryRepo.findOne({filter:{name}})
        if(categoryExist){
            throw new BadRequestException("name already exist")
        }
        const stricBrands = [... new Set(brands||[])]

        if(brands&& (await this.brandRepo.find({filter:{_id:{$in:brands}}})).length != stricBrands.length){
            throw new NotFoundException("brand not found")
        }
        const assetFolderId = randomUUID()
        const url = await this.s3Service.uploadFile({
            path:`categorys ${assetFolderId}`,
            file,
        })
        const category = await this.categoryRepo.create({
            name,
            slogan,
            image:url,
            createdBy:user._id,
            assetFolderId,
            brands:stricBrands
        })
        if(!category){
            await this.s3Service.deleteFile({
                Key:url
            })
            throw new InternalServerErrorException("faild to create category")
        }
        return category
    }
//==================================================================
    async updatecategory(
        id:Types.ObjectId,
        categoryDto:updateCategoryDto,
        user:userDocument,
    ){
        const {name,slogan,brands} = categoryDto
        const category = await this.categoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
        if(!category){
            throw new NotFoundException("category not found")
        }

        if(name&&await this.categoryRepo.findOne({filter:{name}})){
            throw new ConflictException("category already exist")
        }

        const stricBrands = [... new Set(brands||[])]
        if(brands&& (await this.brandRepo.find({filter:{_id:{$in:brands}}})).length != stricBrands.length){
            throw new NotFoundException("brand not found")
        }
        const newcategory =await this.categoryRepo.findOneAndUpdate({_id:id,createdBy:user._id},{name,slogan,brands:stricBrands})
        return newcategory
    }


    async updatecategoryImage(
        id:Types.ObjectId,
        file:Express.Multer.File,
        user:userDocument,
    ){
        const category = await this.categoryRepo.findOne({filter:{_id:id,createdBy:user._id}})
        if(!category){
            throw new NotFoundException("category not found")
        }

        const url = await this.s3Service.uploadFile({
            path:`categorys ${category.assetFolderId}`,
            file
        })
        const newcategory =await this.categoryRepo.findOneAndUpdate({_id:id},{image:url})
        if(!category){
            await this.s3Service.deleteFile({
                Key:url
            })
            throw new InternalServerErrorException("faild to create category")
        }
        await this.s3Service.deleteFile({
            Key:category.image
        })
        return newcategory
    }

    async freezcategory(id:Types.ObjectId,user:userDocument){
        const category =  await this.categoryRepo.findOneAndUpdate({ _id: id },{ deletedAt: new Date(),updatedBy:user._id },{ new: true })
        if(!category){
            throw new NotFoundException("category not found")
        }
        return category 
    }     
//==============================================================
    async restoecategory(id:Types.ObjectId,user:userDocument){
        const category =  await this.categoryRepo.findOneAndUpdate({ _id: id ,deletedAt:{$exists:true},paranoid:false},{ $unset:{deletedAt:""},restoreAt:new Date(),updatedBy:user._id },{ new: true })
        if(!category){
            throw new NotFoundException("category not found or restored")
        }
        return category
    }    
//==============================================================
    async delete(id: Types.ObjectId) {
        const category = await this.categoryRepo.findOne({
            filter: { _id: id, deletedAt: { $exists: true } }
        });
        
        if (!category) {
            throw new NotFoundException("category not found or already restored");
        }
        await this.s3Service.deleteFile({
            Key: category.image, 
        });
        const deletedcategory = await this.categoryRepo.deleteOne({ _id: id, paranoid: false });
        return deletedcategory;
    }
    //==================================================================
    async getAllcategorys(query:queryDto){
        const {page=1,limit=2,search}=query
        const {currentPage,countDoc,totalPages,result} = await this.categoryRepo.paginate({filter:{
            ...(search?{$or:[{name:{$regex:search,$optins:"i"}},{slogan:search,$options:"i"}]}:{})
        },query:{page,limit}})
        return {currentPage,countDoc,totalPages,result}
    }
}
    


