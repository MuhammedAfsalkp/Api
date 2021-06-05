import express from 'express'
import {buildErrObj} from './utils'


class  CommonController {
    ok(res:express.Response,message:any){
        res.status(200).json(message)
    }

    serverError(res:express.Response,message:any){
        res.status(500).json(buildErrObj(500,message))
    }




}






export default CommonController






