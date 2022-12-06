import mongooseService from '../../common/commonservice/mongoose.service'
import db from '../../common/db'

import mongoosePaginate from 'mongoose-paginate-v2'
import mongoose,{Model,Document} from 'mongoose'
import express from 'express'
import { buildErrObj } from '../../common/utils'


class CategoryService extends db{
    private static instance:CategoryService
    schema=mongooseService.getMongoose().Schema
    CategorySchema= new this.schema({
        userId:{
            required:true,
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        },
        name:{
            required:true,
            type:String
        },
        description:{
            required:true,
            type:String
        }

        },{
            versionKey: false,
            timestamps: true
        } ).plugin(mongoosePaginate)

    Category:Model<Document>= mongooseService.getMongoose().model('Category',this.CategorySchema)
    constructor(){
        super()
        this.model=this.Category;

    }
    static getInstance(){
        if(!this.instance){
            return new CategoryService()
        }
        return this.instance
        
    }
    async isPermitted(id:any,res:express.Response){
        return new Promise((resolve,reject)=>{
             this.Category.findById(id).exec((err:any,cat:any)=>{
                 console.log(cat)
                 console.log(res.locals.user.userId)

                if(err||cat==null){
                    reject(buildErrObj(400,'INVALID_REQUEST'))
                }
                else if(cat.userId.toString()==res.locals.user.userId){
                    resolve(true)
                }else{
                reject(buildErrObj(403,'NOT_PERMITTED'))
                }

             })
          


        })
        
    }


}


export default CategoryService.getInstance()