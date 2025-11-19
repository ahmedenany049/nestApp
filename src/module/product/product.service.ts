import { BadRequestException, Body, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BrandRepo, categoryRepo, ProductRepo, UserRepo,} from 'src/DB/repositories';
import { userDocument } from 'src/DB';
import { S3service } from 'src/common/service/s3.service';
import { createProductDto, updateProductDto } from './product.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(
        private readonly _ProductRepo:ProductRepo,
        private readonly brandRepo:BrandRepo,
        private readonly CategoryRepo:categoryRepo,
        private readonly s3Service:S3service,
        private readonly _userRepo:UserRepo,
    ){}
    async createProduct (
        ProductDto:createProductDto,
        user:userDocument,
        files:{mainImage:Express.Multer.File[],subImages:Express.Multer.File[]}
    ){
        let {name,description,brand,price,discount,quantity,stock,category}=ProductDto

        const brandExist = await this.brandRepo.findOne({filter:{_id:brand}})
        if(!brandExist){
            throw new NotFoundException("brand not found")
        }
        const categoryExist = await this.CategoryRepo.findOne({filter:{_id:category}})
        if(!categoryExist){
            throw new NotFoundException("category not found")
        }
        if(stock >quantity){
            return new BadRequestException("stock must less than or equal quantity")
        }
        price = price - (price*((discount||0)/100))
        const filePath = files.mainImage[0]
        const filesPath = files.subImages
        const mainImage = await this.s3Service.uploadFile({
            file:filePath,
            path:`categorys/${categoryExist.assetFolderId}/products/mainImages`,
        })
        const subImages = await this.s3Service.uploadFiles({
            files:filesPath,
            path:`categorys/${categoryExist.assetFolderId}/products/subImages`,
        })
        const product= await this._ProductRepo.create({
            name,
            description,
            price,
            discount,
            quantity,
            stock,
            mainImage,
            subImages,
            brand:Types.ObjectId.createFromHexString(brand.toString()),
            category:Types.ObjectId.createFromHexString(category.toString()),
            createdBy:user._id
        })
        if(!product){
            await this.s3Service.deleteFile({
                Key:mainImage
            })
            await this.s3Service.deleteFiles({
                urls:subImages
            })
            throw new InternalServerErrorException("faild to create product")
        }
        return product
    }


    //============================================================================
    async updateProduct (
        body:updateProductDto,
        user:userDocument,
        id:Types.ObjectId
    ){
        let {name,description,brand,price,discount,quantity,stock,category}=body

        let product = await this._ProductRepo.findOne({filter:{_id:id}})
        if(!product){
            throw new NotFoundException("product not found")
        }
        const brandExist = await this.brandRepo.findOne({filter:{_id:brand}})
        if(!brandExist){
            throw new NotFoundException("brand not found")
        }

        const categoryExist = await this.CategoryRepo.findOne({filter:{_id:category}})
        if(!categoryExist){
            throw new NotFoundException("category not found")
        }
        
        if(price&&discount){
        price = price - (price*(discount/100))
        }else if(price){
            price = price - (price*(product.discount/100))
        }else if(discount){
            price = product.price - (product.price*(discount/100))
        }
        if(stock){
            if(stock >product.quantity){
                throw new BadRequestException("stock should be less than quantity")
            }
        }
        product = await this._ProductRepo.findOneAndUpdate(
        { _id: id },
        {
            ...body,
            price,
            discount,
            quantity,
            stock,
        
        })
        return product
    }

    //========================================================
    async AddToWishList(id:Types.ObjectId,user:userDocument){
        const product = await this._ProductRepo.findOne({filter:{_id:id}})
        if(!product){
            throw new BadRequestException("product not found")
        }
        let userExist = await this._userRepo.findOneAndUpdate(
            {_id:user._id,wishList:{$in:id}},
            {
                $pull:{
                    wishList:id
                }
            }
        )
        if(!userExist){
            userExist = await this._userRepo.findOneAndUpdate(
                {_id:user._id,},
                {
                    $push:{
                        wishList:id
                    }
                }
            )
        }
        return userExist
    }
}   


