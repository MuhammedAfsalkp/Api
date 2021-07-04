import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import{buildErrObj} from '../../common/utils'
import Crypt from '../../common/crypting'
import {JWT} from '../../common/types/jwt'
import userService from './user.service'


const jwtSecret:string=process.env.JWT_SECRET?process.env.JWT_SECRET:''

class Jwt{
    private static instance:Jwt;
    
    static getInstance(){
        if(!this.instance){
            return new Jwt()
        }
        return this.instance

    }
    verifyAccessJwt=async (req:express.Request,res:express.Response,next:express.NextFunction)=>{
        if(req.headers.authorization){
        try{
            const auth=req.headers.authorization.split(' ')
           
            if(auth[0]!='Bearer'){
                 return res.status(401).json(buildErrObj(401,'UNAUTHORIZED'))
            }
            const token=Crypt.decrypt(auth[1])
            res.locals.jwt=jwt.verify(token,jwtSecret) as JWT
            res.locals.user=res.locals.jwt.data
            next()   

        }catch(err){
            return res.status(401).json(buildErrObj(401,'TOKEN_EXPIRED'))
        }
    }else{
        return res.status(401).json(buildErrObj(401,'UNAUTHORIZED'))
    }

    }
    //for validating jwt even it is expired in the case of refreshing
    validateAccessJwtForRefresh(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (req.headers.authorization) {
            try {
                const auth = req.headers.authorization.split(' ');
                if (auth[0] !== 'Bearer') {
                    return res.status(401).send(buildErrObj(401, 'UNAUTHORIZED'))
                } else {
                    let token = Crypt.decrypt(auth[1]);
                    res.locals.jwt = jwt.verify(token, jwtSecret, { ignoreExpiration: true }) as Jwt;
                    res.locals.user = res.locals.jwt.data;
                    next();
                }
            } catch (err) {
                return res.status(401).send(buildErrObj(401, 'UNAUTHORIZED'))
            }
        } else {
            return res.status(401).send(buildErrObj(401, 'UNAUTHORIZED'))
        }

    }

    verifyRefreshJwt=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
        try{
        const user:any=await userService.User.findById(res.locals.jwt.sub)
        const refreshToken:string=req.body.refreshToken
        const token=Crypt.decrypt(refreshToken)
        const payload:any=jwt.verify(token,jwtSecret) as JWT
        const salt=res.locals.user.refreshKey
        const refreshId=res.locals.user.userId
        const hash=crypto.createHmac('sha512',salt).update(refreshId).digest('base64')
        if(hash==payload.sub){
            res.locals.userId=user._id
            return next()

        }else{
            return res.status(401).json(buildErrObj(401,'REFRESH_TOKEN_EXPIRED'))
        }
        }catch(err){
            
            if (typeof err === typeof jwt.NotBeforeError) {
                return res.status(403).send(buildErrObj(403, 'NOT_ACTIVE'));
            } else {
                return res.status(228).send(buildErrObj(228, 'INVALID_REFRESH_TOKEN_OR_EXPIRED'));
            }
            } 
    }

    validateRole=(roles:Array<any>)=> (req:express.Request,res:express.Response,next:express.NextFunction)=>{
        if(req.headers.authorization){
            try{
                console.log("1")
            const auth=req.headers.authorization.split(' ')
           
            if(auth[0]!='Bearer'){
                 return res.status(401).json(buildErrObj(403,'FORBIDDEN'))
            }
            const token=Crypt.decrypt(auth[1])
            res.locals.jwt=jwt.verify(token,jwtSecret) as JWT
            
            const role: string = res.locals.jwt.data.role;
            if (!roles.includes(role)) {
                return res.status(403).send(buildErrObj(403, 'FORBIDDEN'))
            }
            next();
        
        }catch(err){
            return res.status(401).json(buildErrObj(401,'UNAUTHORIZED'))
            }

        }else{
            return res.status(403).send(buildErrObj(403,'FORBIDDEN'))
        }

    }








}


export default Jwt.getInstance()

