import MongooseService from '../../common/service/mongoose.service'
import db from '../../common/db'
import mongooseService from '../../common/service/mongoose.service'

import mongoosePaginate from 'mongoose-paginate-v2'
import {Model,Document} from 'mongoose'

class CategoryService extends db{
    private static instance:CategoryService
    schema=MongooseService.getMongoose().Schema
    CategorySchema= new this.schema({
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


}


export default CategoryService.getInstance()