import express from 'express'
import mongoose from 'mongoose'
import {validationResult} from 'express-validator'


export function handleError(res:express.Response,message:any){
    res.status(message.code).json(message)

}


export function buildErrObj(code:any,message:any){
    return {
        code,
        message        
    }
}

export function  buildSuccessObject(message:any){
    return{
        message
    }
}

export  function validate(req:express.Request,res:express.Response,next:express.NextFunction){
    try{

        validationResult(req).throw()
        console.log("Validation complete without any error")
        return next()
    }catch(err:any){
        const error=err.array()
        console.log(error)
        let e:any={}
        error.forEach((val:any)=>{
            let field=val.param
            e[field]=[val.msg]
            
        })
        return handleError(res,buildErrObj(400,e))
    }
}



export function isIdGood(id:any){
    return new Promise((resolve,reject)=>{
        const good=mongoose.Types.ObjectId.isValid(id)
        return good?resolve(id):reject(buildErrObj(400,'id malformed'))

    })
            
}

export function isEmpty(value: any){{
    return (value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0)
    ||(typeof value==='string' && value.trim().length === 0) )
}

}


export function itemNotFound(err:any,item:any,reject:any,message:any){
    if(err){
        reject(buildErrObj(400,err.message))
    }
    if(!item || item== null){
        reject(buildErrObj(400,'NOT_FOUND'))

    }
}

export function getEnvValue(envName:string,def:any){
    if(envName in process.env){
        return process.env[envName]
    }
    return def;

}
