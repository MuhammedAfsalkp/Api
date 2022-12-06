import {Model,Document} from 'mongoose'
class CommonMiddleWare{
     public model:Model<Document>

     constructor(){
         this.model=Model;
        //correct moddel shoud be assigned correctly from the chils class constructor itself
     }
     
     async checkDuplicate(where: any) {
        try {
            let record=await this.model.findOne(where)
                if (record) {
                    return Promise.reject('ALREADY_EXISTS');
                }
            
        } catch (e) {
            return Promise.reject('ALREADY_EXISTS');
        }
    } 

    async isIDExists(id: any) {
        try {
            let record=await this.model.findById(id)
                if (!record) {
                    return Promise.reject('INVALID_ID');
                }
           
        } catch (e) {
            return Promise.reject('INVALID_ID');
        }
    }


async test(data:any){
    try{
        console.log("working",data)
        return Promise.reject("TEST_ERROR")

    }catch(e){
        console.log(e)
    }

}


}











export default CommonMiddleWare