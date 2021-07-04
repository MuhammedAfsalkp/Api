import bodyParser from 'body-parser';
import express from 'express'
import cors from 'cors'
const env=require('dotenv').config()


import connect from './connections'
import route from './routes'

class App{
   public app:express.Application;
   constructor(){
       this.app=express()
       this.config()
       console.log(process.env.DB_URL)
       console.log(process.env.PORT)
   }
   private config(){
       this.app.use(bodyParser.json());
       this.app.use(bodyParser.urlencoded({extended:true}));
       this.app.use(cors())
       route(this.app)
       connect(this.app)

   }
}
new App()
 //export default new App().app