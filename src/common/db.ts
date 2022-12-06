import {buildErrObj,itemNotFound,buildSuccessObject,isEmpty} from './utils'

import { Model ,Document} from 'mongoose'

export default class db{
    public model:  Model<Document> 
    constructor(){

        this.model=Model;
    }


    async getAllItem(query:any,select:any,sort:any){
        query = isEmpty(query) ? {} : query
        select =isEmpty(select) ? '-createdAt -updatedAt' : select
        sort = isEmpty(sort) ? null : sort
        return new Promise((resolve,reject)=>{
        

            this.model.find(query,select,sort,(err: any,item :any)=>{
                if(err){

                    reject(buildErrObj(400,err.message))
                }
                console.log(item)
                resolve(item)
            })
            
        })

    }


    async createItem(body:any){
        return new Promise((resolve,reject)=>{
            // let add:Array<Object>=[body]
            // console.log(add ,"inside db")
           let add :{}=Array.isArray(body) ? body : [body]
            this.model.create(add,{runValidators:true,new :true},(err:any,item:any)=>{
                if(err){
                    console.log(err.message)
                    reject(buildErrObj(400,err.message))
                
                }
                else{
                    console.log("Success",item)
                    resolve(item[0])
                }
                
            })

        })       

    }

    async getItem(id:any){
        return new Promise((resolve,reject)=>{
            this.model.findById(id,(err:any,item:any)=>{
                itemNotFound(err,item,reject,'NOT-FOUND')
                resolve(item)
            })

        })

    }

    async updateItem(id:any, body:any){
        return new Promise(async(resolve,reject)=>{

            this.model.findByIdAndUpdate(id,body,{runValidators:true,new:true},(err:any,item:any)=>{
                itemNotFound(err,item,reject,'Not-FOUND')
                console.log(item)
                
                
                
                resolve(item)
            })

        })
    }


    async deleteItem(id:any){
        return new Promise((resolve,reject)=>{
        
            this.model.findByIdAndRemove(id,{} ,(err: any, item: any) => {
                itemNotFound(err, item, reject, 'NOT_FOUND')
                console.log(item)
               
                resolve(buildSuccessObject('DELETED'))
            })
            
        })

    }

    public async isExist(where: any) {
        return new Promise((resolve, reject) => {
            this.model.findOne(where, (err: any, item: any) => {
                if (item || err) {
                    return resolve(true)
                } else {
                    return resolve(false)
                }
            })
        })
    }






}