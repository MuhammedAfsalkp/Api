import express from 'express'
import { isConstructorDeclaration } from 'typescript'
const trimRequest=require('trim-request')

import CommonRoutes from '../../common/common.routes'
import authMiddleware from './auth.middleware'
import authController from './auth.controller'
import jwtMiddleware from './jwt.middleware'


class AuthRoutes extends CommonRoutes{
    constructor(app:express.Application){
        super(app,'Authroutes')
    }
    configRoutes():express.Application{
        console.log("Auth route working")

        this.app.post('/auth/register',[trimRequest.all,authMiddleware.validateSignup,authMiddleware.emailExists,authController.register])

        this.app.post('/auth/login',[trimRequest.all,authMiddleware.validateLogin,authController.login])

        this.app.get('/auth/profile',[trimRequest.all,jwtMiddleware.verifyAccessJwt,authController.getProfile])

        this.app.post('/auth/token',[trimRequest.all,jwtMiddleware.validateAccessJwtForRefresh,jwtMiddleware.verifyRefreshJwt,authController.getRefreshToken])

       this.app.get('/auth/user/all',[trimRequest.all,jwtMiddleware.verifyAccessJwt,jwtMiddleware.validateRole(['admin']),authController.getAllItems])

        return this.app
    }

}

export default AuthRoutes