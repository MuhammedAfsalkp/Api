"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trimRequest = require('trim-request');
const common_routes_1 = __importDefault(require("../../common/common.routes"));
const auth_middleware_1 = __importDefault(require("./auth.middleware"));
const auth_controller_1 = __importDefault(require("./auth.controller"));
const jwt_middleware_1 = __importDefault(require("./jwt.middleware"));
class AuthRoutes extends common_routes_1.default {
    constructor(app) {
        super(app, 'Authroutes');
    }
    configRoutes() {
        console.log("Auth route working");
        this.app.post('/auth/register', [trimRequest.all, auth_middleware_1.default.validateSignup, auth_middleware_1.default.emailExists, auth_controller_1.default.register]);
        this.app.post('/auth/login', [trimRequest.all, auth_middleware_1.default.validateLogin, auth_controller_1.default.login]);
        this.app.get('/auth/profile', [trimRequest.all, jwt_middleware_1.default.verifyAccessJwt, auth_controller_1.default.getProfile]);
        this.app.post('/auth/token', [trimRequest.all, jwt_middleware_1.default.validateAccessJwtForRefresh, jwt_middleware_1.default.verifyRefreshJwt, auth_controller_1.default.getRefreshToken]);
        this.app.get('/auth/user/all', [trimRequest.all, jwt_middleware_1.default.verifyAccessJwt, jwt_middleware_1.default.validateRole(['admin']), auth_controller_1.default.getAllItems]);
        return this.app;
    }
}
exports.default = AuthRoutes;
