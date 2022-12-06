import express from 'express'
import CommonRoutes from '../../common/common.routes'

class TestRoutes extends CommonRoutes{
    
    constructor(app:express.Application){
        
        super(app,'testroutes')
        

    }

    configRoutes():express.Application{
        console.log("Test routes Working")
        this.app.get('/test',(req,res)=>{
            res.status(200).send("Updatingg")

        })




        return this.app;
    }
    
}


export default TestRoutes;