"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URI = 'mongodb://127.0.0.1:27017/test';
class MongooseService {
    constructor() {
        this.count = 0;
        this.mongooseOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        };
        console.log("connecting DB..");
        this.connectwithRetry();
    }
    static getInstance() {
        if (!this.instance) {
            return new MongooseService();
        }
        return this.instance;
    }
    getMongoose() {
        return mongoose_1.default;
    }
    connectwithRetry() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield mongoose_1.default.connect(DB_URI, this.mongooseOptions);
                console.log("\n DB connection established..(success)");
            }
            catch (e) {
                console.log(e, `Error connectiong DB...retrying ${++this.count}`);
                setTimeout(this.connectwithRetry, 3000);
            }
        });
    }
}
exports.default = MongooseService.getInstance();
