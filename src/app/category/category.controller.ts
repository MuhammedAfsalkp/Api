import CommonController from '../../common/common.controller'
import categoryService from './category.service'
import {buildSuccessObject, isIdGood} from '../../common/utils'


import express from 'express'
import {matchedData} from 'express-validator'



class  CategoryContoller extends CommonController{

    private static instance:CategoryContoller

    constructor(){
        super()
        
    }

    static getInstance(){
        if(!this.instance){
            this.instance=new CategoryContoller() 
                   
        }
        return this.instance
    }
    getAllItems=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
        console.log(req.query)
        //filter operations,option setting in extending db,ts
        const query=req.query;
        const select={name:1}
        const sort={sort:{name:1},limit:0}
        this.ok(res,await categoryService.getAllItem(query,select,sort))
        }catch(err){
            this.serverError(res,err)
        }

        
        
    }

    getItem=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
            console.log(req.params)
            let params=matchedData(req)
            console.log(params)
            let id=await isIdGood(params.id)
            console.log("Good id")
            this.ok(res,await categoryService.getItem(id))
            
             
            
        }catch(err){
            this.serverError(res,err)
        }
        
    }
    createItem=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
        console.log(req.body)
        let body=matchedData(req)
        body.userId=res.locals.user.userId
        this.ok(res ,await categoryService.createItem(body))


        }catch(err){
            this.serverError(res,err)

        }
     
    
    }

    updateItem=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
        console.log(req.params.id)
        let body=matchedData(req)
        let id=await isIdGood(body.id)
        let allowed=await categoryService.isPermitted(id,res)
        this.ok(res,await categoryService.updateItem(id,body))       
        }catch(err){
            this.serverError(res,err)
        }
       
    }


    deleteItem=async (req: express.Request,  res: express.Response,  next: express.NextFunction)=>{
        try{
            let params=matchedData(req)
            console.log(params)
            let id=await isIdGood(params.id)
            let allowed=await categoryService.isPermitted(id,res)
            this.ok(res,await categoryService.deleteItem(id))

        }catch(err){
            this.serverError(res,err)
        }
       
    }







}


export default CategoryContoller.getInstance()