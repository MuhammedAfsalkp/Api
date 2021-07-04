import mongooseService from '../../common/commonservice/mongoose.service'
import db from '../../common/db'
import {buildErrObj} from '../../common/utils'

import mongoosePaginate from 'mongoose-paginate-v2'
import {Model,Document} from 'mongoose'


class AuthService extends db{
    private static instance:AuthService
    schema=mongooseService.getMongoose().Schema
    userSchema=new this.schema({
        // _id:String,
        userName:{
            required:true,
            type:String
        },
        email:{
            required:true,
            type:String
        },
        password:{
            required:true,
            select:false,
            type:String
        },
        role:{
            required:true,
            type:String,
            default:'normal',
            enum:['normal','admin']
        },
        isActive:{
            required:true,
            type:Boolean,
            default:true,
        }
    },{
            versionKey:false,
            timestamps:true
        }
    ).plugin(mongoosePaginate)

    User:Model<Document>=mongooseService.getMongoose().model('user',this.userSchema)
   
    constructor(){
        super()
        this.model=this.User
    }

    static getInstance(){
        if(!this.instance){
            return new AuthService()
        }
        return this.instance
    }

    async create(body: any) {
        return new Promise((resolve, reject) => {
            const user = new this.User({ ...body });
            user.save((err: any, item: any) => {
                if (err) {
                    reject(buildErrObj(500, err.message))
                } else {
                    resolve(item)
                }
            })
        });
    }

    async findUserByRoleName(userName:string,role:string){
        return new Promise((resolve,reject)=>{

            this.User.findOne({userName,role},'password isActive email userName role').exec((err:any,user:any)=>{
               
                if(err){
                    reject(buildErrObj(400,err.message))
                }
                resolve(user)
     
     
     
            })
     

        })
       
    }

}

export default AuthService.getInstance()