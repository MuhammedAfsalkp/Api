import bodyParser from 'body-parser';
import express from 'express'
// import cors from 'cors'

import connect from './connections'
import route from './routes'

class App{
   public app:express.Application;
   constructor(){
       this.app=express()
       this.config()
   }
   private config(){
       this.app.use(bodyParser.json());
       this.app.use(bodyParser.urlencoded({extended:true}));
       //this.app.use(cors())
       route(this.app)
       connect(this.app)

   }
}

 new App().app