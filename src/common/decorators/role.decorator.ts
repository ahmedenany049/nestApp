import {  UserRole } from "../enums"
import { SetMetadata } from "@nestjs/common"

export const RoleName = "access_role"
export const Role = (access_role_role:UserRole[])=>{
    return SetMetadata(RoleName,UserRole.USER)
}