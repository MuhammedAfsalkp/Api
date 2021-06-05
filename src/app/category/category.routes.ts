import express from 'express'
const trimRequest=require('trim-request')

import CommonRoutes from '../../common/common.routes'
import CategoryController from './category.controller'
import CategoryMiddleware from './category.middleware'

class CategoryRoutes extends CommonRoutes{
   
    constructor(app:express.Application){
        
        super(app,'categoryrotes')
      

    }

    configRoutes(){
        console.log("category routes working")


        this.app.get('/category/all',[CategoryController.getAllItems])

        this.app.get('/category/:id',[trimRequest.all,CategoryMiddleware.validateGetItem,CategoryController.getItem])

        this.app.post('/category',[trimRequest.all,CategoryMiddleware.validateCreateItem,CategoryController.createItem])

        this.app.patch('/category/:id',[trimRequest.all,CategoryMiddleware.validateUpdateItem,CategoryController.updateItem])

        this.app.delete('/category/:id',[trimRequest.all,CategoryMiddleware.validateDeleteItem,CategoryController.deleteItem])




        //return this.app;
    }
    
}


export default CategoryRoutes;