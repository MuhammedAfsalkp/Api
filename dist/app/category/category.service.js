"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_service_1 = __importDefault(require("../../common/service/mongoose.service"));
const db_1 = __importDefault(require("../../common/db"));
const mongoose_service_2 = __importDefault(require("../../common/service/mongoose.service"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
class CategoryService extends db_1.default {
    constructor() {
        super();
        this.schema = mongoose_service_1.default.getMongoose().Schema;
        this.CategorySchema = new this.schema({
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
        this.Category = mongoose_service_2.default.getMongoose().model('Category', this.CategorySchema);
        this.model = this.Category;
    }
    static getInstance() {
        if (!this.instance) {
            return new CategoryService();
        }
        return this.instance;
    }
}
exports.default = CategoryService.getInstance();
