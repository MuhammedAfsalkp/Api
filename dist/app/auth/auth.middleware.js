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
const common_middleware_1 = __importDefault(require("../../common/common.middleware"));
const user_service_1 = __importDefault(require("./user.service"));
const utils_1 = require("../../common/utils");
const utils_2 = require("../../common/utils");
const global_1 = require("../../common/global");
const user_service_2 = __importDefault(require("./user.service"));
const express_validator_1 = require("express-validator");
class AuthMiddleware extends common_middleware_1.default {
    constructor() {
        super();
        this.validateSignup = [
            express_validator_1.check('email')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .trim(),
            express_validator_1.check('userName')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .trim(),
            express_validator_1.check('password')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isLength({ min: 5 })
                .withMessage("TOO_SHORT_MIN_5")
                .bail()
                .trim(),
            express_validator_1.check('confirmPassword')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .trim()
                .custom((value, { req }) => {
                if (value != req.body.password) {
                    throw new Error("NOT_MATCH_CONFIRM");
                }
                return true;
            }),
            express_validator_1.check('role')
                .if((value) => { return this.typeCheckRequired(value); })
                .isIn(global_1.props.userTypes)
                .withMessage("INVALID_ROLE"),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.validateLogin = [
            express_validator_1.check('userName')
                .exists()
                .withMessage('Not_existing')
                .not()
                .isEmpty()
                .withMessage('Empty'),
            express_validator_1.check('password')
                .exists()
                .withMessage('Not_existing')
                .not()
                .isEmpty()
                .withMessage('Empty')
                .trim(),
            express_validator_1.check('role')
                .if((value) => {
                return this.typeCheckRequired(value);
            })
                .isIn(global_1.props.userTypes)
                .withMessage('INVALID_ROLE'),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.validateRefresh = [
            express_validator_1.check('refreshToken')
                .exists()
                .withMessage('Not_existing')
                .not()
                .isEmpty()
                .withMessage('Empty'),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.model = user_service_2.default.User;
    }
    static getInstance() {
        if (!this.instance) {
            return new AuthMiddleware();
        }
        return this.instance;
    }
    emailExists(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = express_validator_1.matchedData(req);
            const email = body.email;
            const role = body.role = (body.role == "" || typeof body.role == typeof undefined) ? global_1.props.normalType : body.role;
            const user = yield user_service_1.default.isExist({ email, role });
            if (user) {
                res.status(400).send(utils_2.buildErrObj(400, {
                    email: ['ALREADY_EXISTS']
                }));
            }
            else {
                next();
            }
        });
    }
    typeCheckRequired(value) {
        return value === '' || typeof value === typeof undefined ? false : true;
    }
}
exports.default = AuthMiddleware.getInstance();
