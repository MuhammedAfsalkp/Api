import express from 'express'

abstract class CommonRoutesConfig{
    app:express.Application
    name:string
    
    constructor(app:express.Application,name:string){
        this.app=app;
        this.name=name;
        // this.configRoutes()

    }
    abstract configRoutes():void
}


export default CommonRoutesConfig