import { Body, Controller, Param, ParseFilePipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Auth, User } from 'src/common/decorators';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import type{ userDocument } from 'src/DB';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/service/utils/multer';
import { ProductService } from './product.service';
import { createProductDto, paramDto, updateProductDto } from './product.dto';

@Controller('Product')
export class ProductController {
    constructor(private readonly ProductService:ProductService){}


//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @UseInterceptors(FileFieldsInterceptor([
        {name:"mainImage",maxCount:1},
        {name:"subImages",maxCount:5}
    ],multerCloud({fileTypes:fileValidation.image})))
    @Post()
    async createProduct(
        @Body() ProductDto:createProductDto,
        @User() user:userDocument,
        @UploadedFiles(ParseFilePipe) files:{mainImage:Express.Multer.File[],subImages:Express.Multer.File[]}
    ){
        const Product = await this.ProductService.createProduct(ProductDto,user,files)
        return {message:"done",Product}
    }

//===========================================================================
    @Put(":id")
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    async updateProduct(
        @Param() Param:paramDto,
        @Body() body:updateProductDto,
        @User() user:userDocument,
    ){
        const Product = await this.ProductService.updateProduct(body,user,Param.id)
        return {message:"done",Product}
    }

    //==========================================================================
    @Auth({
            role:[UserRole.USER],
            tokenType:TokenTypeEnum.access
        })
        @Post("WishList/:id")
        async AddToWishList(
            @Param() param:paramDto,
            @User() user:userDocument,
        ){
            const Product = await this.ProductService.AddToWishList(param.id,user)
            return {message:"done",Product}
        }
    
}
