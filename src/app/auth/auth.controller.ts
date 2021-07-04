import CommonController from '../../common/common.controller'
import userService from './user.service'

import {buildErrObj,getEnvValue} from '../../common/utils'
import{ props } from '../../common/global'
import Crypt from '../../common/crypting'



import express from 'express'
import {matchedData} from 'express-validator'
import argon2 from 'argon2'
import crypto, { Hash } from 'crypto'
import jwt from 'jsonwebtoken'
import { RSA_PSS_SALTLEN_DIGEST } from 'constants'
import mongoose from 'mongoose'


const tokenExpireMinutes=getEnvValue("JWT_ACTIVE_MINUTES",1)
const refreshExpireMinutes=getEnvValue("JWT_REFRESH_ACTIVE_MINUTES",5)
const jwtSecret=getEnvValue('JWT_SECRET',"secret")

class AuthController extends CommonController{
    private static instance:AuthController

    constructor(){
        super()
    }

    static getInstance(){
        if(!this.instance){
            this.instance=new AuthController()
        }
        return this.instance
    }
    

    register=async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
        try{
           
            // await Promise.reject("test")
            let body=matchedData(req)
            body.role=(body.role=="" ||typeof body.role== typeof undefined )?props.normalType:body.role
            console.log(body.role)
            body.password=await argon2.hash(body.password)
            let item=await userService.create(body)
            let risult=await this.createToken(item,{},"register")

            return this.ok(res,risult)
            

        }catch(err){
             this.serverError(res,err)
            
        }
       
    }
    login=async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
        try{
            let body=matchedData(req)
            body.role=(body.role=="" ||typeof body.role== typeof undefined )?props.normalType:body.role
            let user:any=await userService.findUserByRoleName(body.userName,body.role)
           console.log(user)
            if (!user) {
                return this.unauthorized(res, 'NOTAUTHORIZED')
            }
    
            if (!user.isActive) {
                console.log(user.isActive)
                return this.badRequest(res, 'ACCOUNT_DISABLED')
            }
            if(!await argon2.verify(user.password,body.password)){
                return this.badRequest(res,'WRONG_PASSWORD')
            }
            console.log("ok")
            return this.ok(res,await this.createToken(user,{},"login"))




        }catch(err){
            console.log(err)
            this.serverError(res,err)

        }
    }
    createToken= (item:any,params:any,Method:string,)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                console.log("token creating")
                const min=(m:number)=>m*60
                const expiration=Math.floor(Date.now()/1000)+min(+tokenExpireMinutes)
                const refreshExpiration=Math.floor(Date.now()/1000)+min(+refreshExpireMinutes)
                const salt=crypto.randomBytes(16).toString('base64')
                const refreshId=item._id.toString()
                const hash=crypto.createHmac('sha512',salt).update(refreshId).digest('base64')
                const token=jwt.sign({
                    sub:item._id,
                    data:{
                        userId:item._id,
                        userName:item.userName,
                        email:item.email,
                        role:item.role,
                        refreshKey:salt
                    },
                    exp:expiration
                },jwtSecret)
                const refreshToken=jwt.sign({sub:hash,exp:refreshExpiration,nbf:expiration},jwtSecret)
                let user=item;
                delete user.password
                console.log(user)
                console.log(user._id)
                let result: any = {
                    user: user,
                    token: Crypt.encrypt(token),
                    refreshToken: Crypt.encrypt(refreshToken),
                    expiresAt: (new Date(expiration*1000).toTimeString()),
                    RefreshexpiresAt: (new Date(refreshExpiration*1000).toTimeString()),
                    expiresIn: tokenExpireMinutes,
                    refreshExpiresIn:refreshExpireMinutes,
                    loginMethod: Method,
                    tkn:token,
                    rftkn:refreshToken

                }
                resolve(result)
                

            }catch(err){
                console.log(err)
                reject(buildErrObj(228, 'TOKEN_GENERATION_FAILED'))
                
            }
        })


        
    }

    getProfile=async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
        try{
        let userId =res.locals.user.userId 
        const user = await userService.User.findById(userId)
        if(!user){  
            return this.notFound(res,'NOT_FOUND')
        }
        return this.ok(res, user)

        }catch(err){
          return  this.serverError(res,err.message)
        }
    }
    
    getRefreshToken=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
        try{
        const user=await userService.User.findById(res.locals.userId)
        return this.ok(res,await this.createToken(user,{},'refreshtoken'))
        }catch(err){
            return this.serverError(res,err.message)
        }
    }
    getAllItems=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
            console.log("controller")
        console.log(req.query)
        //filter operations,option setting in extending dbts
        const query=req.query;
        const select={userName:1,role:1}
        const sort={sort:{userName:1},limit:0}
        this.ok(res,await userService.getAllItem(query,select,sort))
        }catch(err){
            this.serverError(res,err)
        }

        
        
    }


}

export default AuthController.getInstance()