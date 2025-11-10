import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BrandService } from './brand.service';
import { createBrandDto, idDto, queryDto, updateBrandDto } from './brand.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import type{ userDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/service/utils/multer';
import { Types } from 'mongoose';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService:BrandService){}


//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @UseInterceptors(FileInterceptor("attachment",multerCloud({fileTypes:fileValidation.image})))
    @Post()
    async createBrand(
        @Body() brandDto:createBrandDto,
        @User() user:userDocument,
        @UploadedFile(ParseFilePipe) file:Express.Multer.File
    ){
        const brand = await this.brandService.createBrand(brandDto,user,file)
        return {message:"done",brand}
    }
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch("/update/:id")
    async updateBrand(
        @Param() params:idDto,
        @Body() brandDto:updateBrandDto,
        @User() user:userDocument,
    ){
        const brand = await this.brandService.updateBrand(params.id,brandDto,user)
        return {message:"done",brand}
    }

//====================================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @UseInterceptors(FileInterceptor("attachment",multerCloud({fileTypes:fileValidation.image})))
    @Patch("/image/:id")
    async updateBrandImage(
        @Param() params:idDto,
        @User() user:userDocument,
        @UploadedFile(ParseFilePipe) file:Express.Multer.File

    ){
        const brand = await this.brandService.updateBrandImage(params.id,file,user)
        return {message:"done",brand}
    }

//=================================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch("/freezBrand/:id")
    async freezBrand(
        @Param() params:idDto,
        @User() user:userDocument,
    ){
        const brand = await this.brandService.freezBrand(params.id,user)
        return {message:"done",brand}
    }

//==============================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch("/restoeBrand/:id")
    async restoeBrand(
        @Param() params:idDto,
        @User() user:userDocument,
    ){
        const brand = await this.brandService.restoeBrand(params.id,user)
        return {message:"done",brand}
    }
//==============================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Delete(":id")
    async delete(
        @Param() params:idDto,
    ){
        const brand = await this.brandService.delete(params.id)
        return {message:"done",brand}
    }
    
    @Get()
    async getAllBrands(
        @Query() query:queryDto,
    ){
        const brands = await this.brandService.getAllBrands(query)
        return {message:"done",brands}
    }
}
