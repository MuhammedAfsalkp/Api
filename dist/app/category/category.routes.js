"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trimRequest = require('trim-request');
const common_routes_1 = __importDefault(require("../../common/common.routes"));
const category_controller_1 = __importDefault(require("./category.controller"));
const category_middleware_1 = __importDefault(require("./category.middleware"));
const jwt_middleware_1 = __importDefault(require("../auth/jwt.middleware"));
class CategoryRoutes extends common_routes_1.default {
    constructor(app) {
        super(app, 'categoryrotes');
    }
    configRoutes() {
        console.log("category routes working");
        this.app.get('/category/all', [category_controller_1.default.getAllItems]);
        this.app.get('/category/:id', [trimRequest.all, category_middleware_1.default.validateGetItem, category_controller_1.default.getItem]);
        this.app.post('/category', [jwt_middleware_1.default.verifyAccessJwt, jwt_middleware_1.default.validateRole(['admin']), trimRequest.all, category_middleware_1.default.validateCreateItem, category_controller_1.default.createItem]);
        this.app.patch('/category/:id', [jwt_middleware_1.default.verifyAccessJwt, jwt_middleware_1.default.validateRole(['admin']), trimRequest.all, category_middleware_1.default.validateUpdateItem, category_controller_1.default.updateItem]);
        this.app.delete('/category/:id', [jwt_middleware_1.default.verifyAccessJwt, jwt_middleware_1.default.validateRole(['admin']), trimRequest.all, category_middleware_1.default.validateDeleteItem, category_controller_1.default.deleteItem]);
        return this.app;
    }
}
exports.default = CategoryRoutes;
