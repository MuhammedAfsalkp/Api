import CommonMiddleWare from '../../common/common.middleware'
import {validate} from '../../common/utils'

import {check} from 'express-validator'
import express from 'express'


class CategoryMiddleware extends CommonMiddleWare{
    private static instance: CategoryMiddleware 
    constructor(){
        super()
    }

    static getInstance(){
        if(!this.instance){
            return new CategoryMiddleware()
        }
        return this.instance
    }

    validateCreateItem=[
        check('name')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isAlpha('en-US',{ignore:' '})
        .withMessage('Mustbe alphabetic')
        .bail()
        .trim(),
        check('description')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isLength({min:3})
        .withMessage('Minlength')
        .bail()
        .trim(),
        (req:express.Request, res:express.Response, next:express.NextFunction)=>{
            validate(req,res,next)          
        }
    ]


    validateGetItem=[
        check('id')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isMongoId()
        .withMessage("Not_mongoid")
        .trim(),
        (req:express.Request,res:express.Response,next:express.NextFunction)=>{
            validate(req,res,next)
        }


    ]


    validateUpdateItem=[
        check('id')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isMongoId()
        .withMessage("Not_mongoid")
        .trim(),

        check('name')
        .exists()
        .withMessage("Not_existing")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isAlpha('en-US',{ignore:' '})
        .withMessage('Mustbe alphabetic')
        .bail()
        .trim(),
        (req: express.Request,res :express.Response,next: express.NextFunction)=>{
            validate(req,res,next)
            
        }


    ]

    validateDeleteItem=[
        check('id')
        .exists()
        .withMessage("Not_found")
        .bail()
        .not()
        .isEmpty()
        .withMessage("Empty")
        .bail()
        .isMongoId()
        .withMessage("Not_mongoid")
        .trim(),
        (req: express.Request,res:express.Response,next:express.NextFunction)=>{
            validate(req,res,next)
        }


    ]







}

export default CategoryMiddleware.getInstance()