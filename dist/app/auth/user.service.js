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
const mongoose_service_1 = __importDefault(require("../../common/commonservice/mongoose.service"));
const db_1 = __importDefault(require("../../common/db"));
const utils_1 = require("../../common/utils");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
class AuthService extends db_1.default {
    constructor() {
        super();
        this.schema = mongoose_service_1.default.getMongoose().Schema;
        this.userSchema = new this.schema({
            // _id:String,
            userName: {
                required: true,
                type: String
            },
            email: {
                required: true,
                type: String
            },
            password: {
                required: true,
                select: false,
                type: String
            },
            role: {
                required: true,
                type: String,
                default: 'normal',
                enum: ['normal', 'admin']
            },
            isActive: {
                required: true,
                type: Boolean,
                default: true,
            }
        }, {
            versionKey: false,
            timestamps: true
        }).plugin(mongoose_paginate_v2_1.default);
        this.User = mongoose_service_1.default.getMongoose().model('user', this.userSchema);
        this.model = this.User;
    }
    static getInstance() {
        if (!this.instance) {
            return new AuthService();
        }
        return this.instance;
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const user = new this.User(Object.assign({}, body));
                user.save((err, item) => {
                    if (err) {
                        reject(utils_1.buildErrObj(500, err.message));
                    }
                    else {
                        resolve(item);
                    }
                });
            });
        });
    }
    findUserByRoleName(userName, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.User.findOne({ userName, role }, 'password isActive email userName role').exec((err, user) => {
                    if (err) {
                        reject(utils_1.buildErrObj(400, err.message));
                    }
                    resolve(user);
                });
            });
        });
    }
}
exports.default = AuthService.getInstance();
