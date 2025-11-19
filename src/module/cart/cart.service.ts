import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepo, userDocument } from 'src/DB';
import { CartRepo } from 'src/DB/repositories/cart.rebo';
import { createCartDto, updateQuantityDto } from './cart.dto';
import { Types } from 'mongoose';

@Injectable()
export class CartService {
    constructor(
        private readonly cartRepo:CartRepo,
        private readonly productRepo:ProductRepo,
    ){}
    async createCart (
        body:createCartDto,
        user:userDocument,
    ){
        const {productId,quantity} = body
        const product = await this.productRepo.findOne({
            filter:{
                _id:productId,
                stock:{$gte:quantity}
            }})
        if(!product){
            throw new BadRequestException("product not found")
        }
        const cart = await this.cartRepo.findOne({
            filter:{
                createdBy:user._id
            }})
        if(!cart){
            const newCart = await this.cartRepo.create({
                createdBy:user._id,
                products:[
                    {
                        productId,
                        quantity,
                        finalPrice:product.price
                    }
                ]
            })
            return newCart
        }
        const productCart = cart.products.find((product)=>product.productId.toString()===productId.toString())
        if(productCart){
            throw new BadRequestException("product already exist")
        }
        cart.products.push({
            productId,
            quantity,
            finalPrice:product.price
        })
        await cart.save()
        return cart
    }

    //====================================================================
    async removeProductFromCart (
        id:Types.ObjectId,
        user:userDocument,
    ){
        const product = await this.productRepo.findOne({filter:{_id:id,}})
        if(!product){
            throw new BadRequestException("product not found")
        }
        const cart = await this.cartRepo.findOne({
            filter:{
                createdBy:user._id,
                product:{$elemMatch:{productId:id}}
            }})
        if(!cart){
            throw new BadRequestException("cart not found")
        }
        cart.products = cart.products.filter((product)=>product.productId.toString()!==id.toString())
        await cart.save()
        return cart
    }

    //====================================================================
    async updateProductFromCart (
        id:Types.ObjectId,
        user:userDocument,
        body:updateQuantityDto
    ){
        const {quantity}=body
        const cart = await this.cartRepo.findOne({
            filter:{
                createdBy:user._id,
                product:{$elemMatch:{productId:id}}
            }})
        if(!cart){
            throw new BadRequestException("cart not found")
        }
        cart.products.find((product)=>{
            if(product.productId.toString()===id.toString()){
                product.quantity = quantity
                return product 
            }
        })
        await cart.save()
        return cart
    }

}   


