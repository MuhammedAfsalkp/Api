import express from 'express'
import {buildErrObj} from './utils'


class  CommonController {
    ok(res:express.Response,message:any){
        res.status(200).json(message)
    }

    serverError(res:express.Response,message:any){
        res.status(500).json(buildErrObj(500,message))
    }
    badRequest(res: express.Response, message: any) {
        res.status(400).json(buildErrObj(400, message));
    }
    unauthorized(res: express.Response, message: any) {
        res.status(401).json(buildErrObj(401, message));
    }
    notFound(res: express.Response, message: any) {
        res.status(404).json(buildErrObj(404, message));
    }
    tokenGenerationError(res:express.Response,message:any){
        res.status(228).json(buildErrObj(228,message))
    }




}






export default CommonController






