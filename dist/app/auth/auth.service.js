"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../../common/commonservice/mongoose.service"));
const db_1 = __importDefault(require("../../common/db"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
class AuthService extends db_1.default {
    constructor() {
        super();
        this.schema = mongoose_service_1.default.getMongoose().Schema;
        this.userSchema = new this.schema({
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
}
exports.default = AuthService.getInstance();
