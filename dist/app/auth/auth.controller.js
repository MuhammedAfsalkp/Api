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
const common_controller_1 = __importDefault(require("../../common/common.controller"));
const user_service_1 = __importDefault(require("./user.service"));
const utils_1 = require("../../common/utils");
const global_1 = require("../../common/global");
const crypting_1 = __importDefault(require("../../common/crypting"));
const express_validator_1 = require("express-validator");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenExpireMinutes = utils_1.getEnvValue("JWT_ACTIVE_MINUTES", 1);
const refreshExpireMinutes = utils_1.getEnvValue("JWT_REFRESH_ACTIVE_MINUTES", 5);
const jwtSecret = utils_1.getEnvValue('JWT_SECRET', "secret");
class AuthController extends common_controller_1.default {
    constructor() {
        super();
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                // await Promise.reject("test")
                let body = express_validator_1.matchedData(req);
                body.role = (body.role == "" || typeof body.role == typeof undefined) ? global_1.props.normalType : body.role;
                console.log(body.role);
                body.password = yield argon2_1.default.hash(body.password);
                let item = yield user_service_1.default.create(body);
                let risult = yield this.createToken(item, {}, "register");
                return this.ok(res, risult);
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let body = express_validator_1.matchedData(req);
                body.role = (body.role == "" || typeof body.role == typeof undefined) ? global_1.props.normalType : body.role;
                let user = yield user_service_1.default.findUserByRoleName(body.userName, body.role);
                console.log(user);
                if (!user) {
                    return this.unauthorized(res, 'NOTAUTHORIZED');
                }
                if (!user.isActive) {
                    console.log(user.isActive);
                    return this.badRequest(res, 'ACCOUNT_DISABLED');
                }
                if (!(yield argon2_1.default.verify(user.password, body.password))) {
                    return this.badRequest(res, 'WRONG_PASSWORD');
                }
                console.log("ok");
                return this.ok(res, yield this.createToken(user, {}, "login"));
            }
            catch (err) {
                console.log(err);
                this.serverError(res, err);
            }
        });
        this.createToken = (item, params, Method) => {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("token creating");
                    const min = (m) => m * 60;
                    const expiration = Math.floor(Date.now() / 1000) + min(+tokenExpireMinutes);
                    const refreshExpiration = Math.floor(Date.now() / 1000) + min(+refreshExpireMinutes);
                    const salt = crypto_1.default.randomBytes(16).toString('base64');
                    const refreshId = item._id.toString();
                    const hash = crypto_1.default.createHmac('sha512', salt).update(refreshId).digest('base64');
                    const token = jsonwebtoken_1.default.sign({
                        sub: item._id,
                        data: {
                            userId: item._id,
                            userName: item.userName,
                            email: item.email,
                            role: item.role,
                            refreshKey: salt
                        },
                        exp: expiration
                    }, jwtSecret);
                    const refreshToken = jsonwebtoken_1.default.sign({ sub: hash, exp: refreshExpiration, nbf: expiration }, jwtSecret);
                    let user = item;
                    delete user.password;
                    console.log(user);
                    console.log(user._id);
                    let result = {
                        user: user,
                        token: crypting_1.default.encrypt(token),
                        refreshToken: crypting_1.default.encrypt(refreshToken),
                        expiresAt: (new Date(expiration * 1000).toTimeString()),
                        RefreshexpiresAt: (new Date(refreshExpiration * 1000).toTimeString()),
                        expiresIn: tokenExpireMinutes,
                        refreshExpiresIn: refreshExpireMinutes,
                        loginMethod: Method,
                        tkn: token,
                        rftkn: refreshToken
                    };
                    resolve(result);
                }
                catch (err) {
                    console.log(err);
                    reject(utils_1.buildErrObj(228, 'TOKEN_GENERATION_FAILED'));
                }
            }));
        };
        this.getProfile = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let userId = res.locals.user.userId;
                const user = yield user_service_1.default.User.findById(userId);
                if (!user) {
                    return this.notFound(res, 'NOT_FOUND');
                }
                return this.ok(res, user);
            }
            catch (err) {
                return this.serverError(res, err.message);
            }
        });
        this.getRefreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.User.findById(res.locals.userId);
                return this.ok(res, yield this.createToken(user, {}, 'refreshtoken'));
            }
            catch (err) {
                return this.serverError(res, err.message);
            }
        });
        this.getAllItems = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("controller");
                console.log(req.query);
                //filter operations,option setting in extending dbts
                const query = req.query;
                const select = { userName: 1, role: 1 };
                const sort = { sort: { userName: 1 }, limit: 0 };
                this.ok(res, yield user_service_1.default.getAllItem(query, select, sort));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new AuthController();
        }
        return this.instance;
    }
}
exports.default = AuthController.getInstance();
