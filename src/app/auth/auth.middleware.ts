import CommonMiddleWare from '../../common/common.middleware'
import userService from './user.service'
import {validate} from '../../common/utils'
import { buildErrObj } from '../../common/utils'
import {props} from '../../common/global'
import AuthSchema from './user.service'


import {check, matchedData} from 'express-validator'
import express from 'express'

class AuthMiddleware extends CommonMiddleWare{
    private static instance:AuthMiddleware
    constructor(){
        super()
        this.model=AuthSchema.User
    }

    static getInstance(){
        if(!this.instance){
            return new AuthMiddleware()
        }
        return this.instance
    }

    validateSignup=[
        check('email')
        .exists()
        .withMessage("Not_existing")
         .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .trim(),

        check('userName')
        .exists()
        .withMessage("Not_existing")
         .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .trim(),
        
        check('password')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isLength({min:5})
        .withMessage("TOO_SHORT_MIN_5")
        .bail()
        .trim(),
        
        check('confirmPassword')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .trim()
        .custom((value,{req})=>{
            if(value != req.body.password){
                throw new Error("NOT_MATCH_CONFIRM")
            }
            return true
        }),

        check('role')
        .if((value:any)=>{return this.typeCheckRequired(value)})
        .isIn(props.userTypes)
        .withMessage("INVALID_ROLE")
        
        ,(req:express.Request,res:express.Response,next:express.NextFunction)=>{
            validate(req,res,next)
        }
    ]

     validateLogin = [
        check('userName')
            .exists()
            .withMessage('Not_existing')
            .not()
            .isEmpty()
            .withMessage('Empty'),
        check('password')
            .exists()
            .withMessage('Not_existing')
            .not()
            .isEmpty()
            .withMessage('Empty')
            .trim(),
        check('role')
            .if((value: string) => {
                return this.typeCheckRequired(value);
            })
            .isIn(props.userTypes)
            .withMessage('INVALID_ROLE'),
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            validate(req, res, next)
        }
    ]

    validateRefresh = [
        check('refreshToken')
            .exists()
            .withMessage('Not_existing')
            .not()
            .isEmpty()
            .withMessage('Empty'),
        (req: express.Request, res: express.Response, next: express.NextFunction) => {
            validate(req, res, next)
        }
    ]



    async emailExists(req: express.Request, res: express.Response, next: express.NextFunction) {
        const body:any = matchedData(req);
        const email=body.email
        const role= body.role=(body.role=="" ||typeof body.role== typeof undefined )?props.normalType:body.role
        const user = await userService.isExist({ email ,role});
            if (user) {
                res.status(400).send(buildErrObj(400, {
                    email: ['ALREADY_EXISTS']
                }));
            } else {
                next();
            }
        }


    private typeCheckRequired(value: string): boolean {
            return value === '' || typeof value === typeof undefined ? false : true
        }
    
    
    




}


export default AuthMiddleware.getInstance()
