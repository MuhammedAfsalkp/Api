import express from 'express'
const trimRequest=require('trim-request')

import CommonRoutes from '../../common/common.routes'
import CategoryController from './category.controller'
import CategoryMiddleware from './category.middleware'
import jwtMiddleware from '../auth/jwt.middleware'

class CategoryRoutes extends CommonRoutes{
   
    constructor(app:express.Application){
        
        super(app,'categoryrotes')
      

    }

    configRoutes():express.Application{
        console.log("category routes working")


        this.app.get('/category/all',[CategoryController.getAllItems])

        this.app.get('/category/:id',[trimRequest.all,CategoryMiddleware.validateGetItem,CategoryController.getItem])

        this.app.post('/category',[jwtMiddleware.verifyAccessJwt,jwtMiddleware.validateRole(['admin']),trimRequest.all,CategoryMiddleware.validateCreateItem,CategoryController.createItem])

        this.app.patch('/category/:id',[jwtMiddleware.verifyAccessJwt,jwtMiddleware.validateRole(['admin']),trimRequest.all,CategoryMiddleware.validateUpdateItem,CategoryController.updateItem])

        this.app.delete('/category/:id',[jwtMiddleware.verifyAccessJwt,jwtMiddleware.validateRole(['admin']),trimRequest.all,CategoryMiddleware.validateDeleteItem,CategoryController.deleteItem])




        return this.app;
    }
    
}


export default CategoryRoutes;