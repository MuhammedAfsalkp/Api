"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const secret = process.env.JWT_SECRET || '';
const algorithm = 'aes-192-cbc';
const key = crypto_1.default.scryptSync(secret, 'salt', 24); //24byte=192 bit
const iv = Buffer.alloc(16, 0);
class Crypt {
    static getInstance() {
        if (!this.instance) {
            this.instance = new Crypt();
        }
        return this.instance;
    }
    encrypt(text) {
        // throw new Error('crypting error')
        const clipher = crypto_1.default.createCipheriv(algorithm, key, iv);
        let encrypted = clipher.update(text, 'utf-8', 'hex');
        encrypted += clipher.final('hex');
        return encrypted;
    }
    decrypt(text) {
        const declipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        let decrypted = declipher.update(text, 'hex', 'utf-8');
        decrypted += declipher.final('utf-8');
        return decrypted;
    }
}
exports.default = Crypt.getInstance();
