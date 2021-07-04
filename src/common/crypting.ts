import crypto from 'crypto'
const secret = process.env.JWT_SECRET || '';
const algorithm = 'aes-192-cbc'
const key = crypto.scryptSync(secret, 'salt', 24)//24byte=192 bit
const iv = Buffer.alloc(16, 0)

class Crypt{
    private static instance:Crypt;
    static getInstance(){
        if(!this.instance){
            this.instance=new Crypt()
        }
        return this.instance
    }
    
    encrypt(text:string){
        // throw new Error('crypting error')
        const clipher=crypto.createCipheriv(algorithm,key,iv)
        let encrypted=clipher.update(text,'utf-8','hex')
        encrypted+=clipher.final('hex')
        return encrypted
    }

    decrypt(text:string){
        const declipher=crypto.createDecipheriv(algorithm,key,iv)
        let decrypted=declipher.update(text,'hex','utf-8')
        decrypted+=declipher.final('utf-8')
        return decrypted
    }
}


export default Crypt.getInstance()