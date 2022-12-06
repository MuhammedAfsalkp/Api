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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const utils_1 = require("../../common/utils");
const crypting_1 = __importDefault(require("../../common/crypting"));
const user_service_1 = __importDefault(require("./user.service"));
const jwtSecret = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
class Jwt {
    constructor() {
        this.verifyAccessJwt = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (req.headers.authorization) {
                try {
                    const auth = req.headers.authorization.split(' ');
                    if (auth[0] != 'Bearer') {
                        return res.status(401).json(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
                    }
                    const token = crypting_1.default.decrypt(auth[1]);
                    res.locals.jwt = jsonwebtoken_1.default.verify(token, jwtSecret);
                    res.locals.user = res.locals.jwt.data;
                    next();
                }
                catch (err) {
                    return res.status(401).json(utils_1.buildErrObj(401, 'TOKEN_EXPIRED'));
                }
            }
            else {
                return res.status(401).json(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
            }
        });
        this.verifyRefreshJwt = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.User.findById(res.locals.jwt.sub);
                const refreshToken = req.body.refreshToken;
                const token = crypting_1.default.decrypt(refreshToken);
                const payload = jsonwebtoken_1.default.verify(token, jwtSecret);
                const salt = res.locals.user.refreshKey;
                const refreshId = res.locals.user.userId;
                const hash = crypto_1.default.createHmac('sha512', salt).update(refreshId).digest('base64');
                if (hash == payload.sub) {
                    res.locals.userId = user._id;
                    return next();
                }
                else {
                    return res.status(401).json(utils_1.buildErrObj(401, 'REFRESH_TOKEN_EXPIRED'));
                }
            }
            catch (err) {
                if (typeof err === typeof jsonwebtoken_1.default.NotBeforeError) {
                    return res.status(403).send(utils_1.buildErrObj(403, 'NOT_ACTIVE'));
                }
                else {
                    return res.status(228).send(utils_1.buildErrObj(228, 'INVALID_REFRESH_TOKEN_OR_EXPIRED'));
                }
            }
        });
        this.validateRole = (roles) => (req, res, next) => {
            if (req.headers.authorization) {
                try {
                    console.log("1");
                    const auth = req.headers.authorization.split(' ');
                    if (auth[0] != 'Bearer') {
                        return res.status(401).json(utils_1.buildErrObj(403, 'FORBIDDEN'));
                    }
                    const token = crypting_1.default.decrypt(auth[1]);
                    res.locals.jwt = jsonwebtoken_1.default.verify(token, jwtSecret);
                    const role = res.locals.jwt.data.role;
                    if (!roles.includes(role)) {
                        return res.status(403).send(utils_1.buildErrObj(403, 'FORBIDDEN'));
                    }
                    next();
                }
                catch (err) {
                    return res.status(401).json(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
                }
            }
            else {
                return res.status(403).send(utils_1.buildErrObj(403, 'FORBIDDEN'));
            }
        };
    }
    static getInstance() {
        if (!this.instance) {
            return new Jwt();
        }
        return this.instance;
    }
    //for validating jwt even it is expired in the case of refreshing
    validateAccessJwtForRefresh(req, res, next) {
        if (req.headers.authorization) {
            try {
                const auth = req.headers.authorization.split(' ');
                if (auth[0] !== 'Bearer') {
                    return res.status(401).send(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
                }
                else {
                    let token = crypting_1.default.decrypt(auth[1]);
                    res.locals.jwt = jsonwebtoken_1.default.verify(token, jwtSecret, { ignoreExpiration: true });
                    res.locals.user = res.locals.jwt.data;
                    next();
                }
            }
            catch (err) {
                return res.status(401).send(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
            }
        }
        else {
            return res.status(401).send(utils_1.buildErrObj(401, 'UNAUTHORIZED'));
        }
    }
}
exports.default = Jwt.getInstance();
