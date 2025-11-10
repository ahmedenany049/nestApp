import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { createCategoryDto, idDto, queryDto, updateCategoryDto } from './category.dto';
import { Auth, User } from 'src/common/decorators';
import { TokenTypeEnum, UserRole } from 'src/common/enums';
import type{ userDocument } from 'src/DB';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileValidation, multerCloud } from 'src/common/service/utils/multer';
import { categoryService } from './category.service';

@Controller('category')
export class categoryController {
    constructor(private readonly categoryService:categoryService){}


//===========================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @UseInterceptors(FileInterceptor("attachment",multerCloud({fileTypes:fileValidation.image})))
    @Post()
    async createcategory(
        @Body() categoryDto:createCategoryDto,
        @User() user:userDocument,
        @UploadedFile(ParseFilePipe) file:Express.Multer.File
    ){
        const category = await this.categoryService.createcategory(categoryDto,user,file)
        return {message:"done",category}
    }
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    //========================================================================
    @Patch("/update/:id")
    async updatecategory(
        @Param() params:idDto,
        @Body() categoryDto:updateCategoryDto,
        @User() user:userDocument,
    ){
        const category = await this.categoryService.updatecategory(params.id,categoryDto,user)
        return {message:"done",category}
    }

//====================================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @UseInterceptors(FileInterceptor("attachment",multerCloud({fileTypes:fileValidation.image})))
    @Patch("/image/:id")
    async updatecategoryImage(
        @Param() params:idDto,
        @User() user:userDocument,
        @UploadedFile(ParseFilePipe) file:Express.Multer.File

    ){
        const category = await this.categoryService.updatecategoryImage(params.id,file,user)
        return {message:"done",category}
    }

//=================================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch("/freezcategory/:id")
    async freezcategory(
        @Param() params:idDto,
        @User() user:userDocument,
    ){
        const category = await this.categoryService.freezcategory(params.id,user)
        return {message:"done",category}
    }

//==============================================================================
    @Auth({
        role:[UserRole.USER],
        tokenType:TokenTypeEnum.access
    })
    @Patch("/restoecategory/:id")
    async restoecategory(
        @Param() params:idDto,
        @User() user:userDocument,
    ){
        const category = await this.categoryService.restoecategory(params.id,user)
        return {message:"done",category}
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
        const category = await this.categoryService.delete(params.id)
        return {message:"done",category}
    }
    
    @Get()
    async getAllcategorys(
        @Query() query:queryDto,
    ){
        const categorys = await this.categoryService.getAllcategorys(query)
        return {message:"done",categorys}
    }
}
