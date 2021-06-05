import express from 'express'
import CategoryRoutes from './app/category/category.routes'
import TestRoutes from './app/test/test.routes'
import CommonRoutesConfig from './common/common.routes';


const routes=(app:express.Application)=>{
    const allRoutes:Array<CommonRoutesConfig>=[];
    allRoutes.push(new CategoryRoutes(app))
    allRoutes.push(new TestRoutes(app))

    allRoutes.forEach((val:CommonRoutesConfig)=>{
        console.log(`routes configured for ${val.name}`)
        val.configRoutes()
    })

    

}


export default routes;