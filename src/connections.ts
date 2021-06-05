import express from 'express'

const PORT=3000;

const connect=async (app:express.Application)=>{
    try{
    app.listen(PORT,()=>console.log(`Server connected on port ${PORT}`))
    } catch(err){
        console.log("Error connecting server!!!",err)
    }
    

}


export default connect;