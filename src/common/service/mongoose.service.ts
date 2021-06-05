import mongoose from 'mongoose'

const DB_URI='mongodb://127.0.0.1:27017/test'

class MongooseService{
    
    private static instance: MongooseService;
    private count=0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify:false
    };

    static getInstance(){
        if(!this.instance){
            return new MongooseService()

        }
        return this.instance
    }
     getMongoose(){
         return mongoose
     }


    constructor(){
        console.log("connecting DB..")
        this.connectwithRetry()
    }


    async connectwithRetry(){
        
        try{
            const db=await mongoose.connect(DB_URI,this.mongooseOptions)
            console.log("\n DB connection established..(success)")
     
        }catch(e){
            console.log(e,`Error connectiong DB...retrying ${++this.count}`)
            setTimeout(this.connectwithRetry,3000)
        }

    }

}


export default MongooseService.getInstance()