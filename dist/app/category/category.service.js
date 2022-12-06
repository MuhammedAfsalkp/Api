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
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const mongoose_1 = __importDefault(require("mongoose"));
const utils_1 = require("../../common/utils");
class CategoryService extends db_1.default {
    constructor() {
        super();
        this.schema = mongoose_service_1.default.getMongoose().Schema;
        this.CategorySchema = new this.schema({
            userId: {
                required: true,
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: {
                required: true,
                type: String
            },
            description: {
                required: true,
                type: String
            }
        }, {
            versionKey: false,
            timestamps: true
        }).plugin(mongoose_paginate_v2_1.default);
        this.Category = mongoose_service_1.default.getMongoose().model('Category', this.CategorySchema);
        this.model = this.Category;
    }
    static getInstance() {
        if (!this.instance) {
            return new CategoryService();
        }
        return this.instance;
    }
    isPermitted(id, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.Category.findById(id).exec((err, cat) => {
                    console.log(cat);
                    console.log(res.locals.user.userId);
                    if (err || cat == null) {
                        reject(utils_1.buildErrObj(400, 'INVALID-REQUEST'));
                    }
                    else if (cat.userId.toString() == res.locals.user.userId) {
                        resolve(true);
                    }
                    else {
                        reject(utils_1.buildErrObj(403, 'NOT_PERMITTED'));
                    }
                });
            });
        });
    }
}
exports.default = CategoryService.getInstance();
