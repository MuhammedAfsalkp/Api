"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_middleware_1 = __importDefault(require("../../common/common.middleware"));
const utils_1 = require("../../common/utils");
const express_validator_1 = require("express-validator");
class CategoryMiddleware extends common_middleware_1.default {
    constructor() {
        super();
        this.validateCreateItem = [
            express_validator_1.check('name')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isAlpha('en-US', { ignore: ' ' })
                .withMessage('Mustbe alphabetic')
                .bail()
                .trim(),
            express_validator_1.check('description')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isLength({ min: 3 })
                .withMessage('Minlength')
                .bail()
                .trim(),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.validateGetItem = [
            express_validator_1.check('id')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isMongoId()
                .withMessage("Not_mongoid")
                .trim(),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.validateUpdateItem = [
            express_validator_1.check('id')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isMongoId()
                .withMessage("Not_mongoid")
                .trim(),
            express_validator_1.check('name')
                .exists()
                .withMessage("Not_existing")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isAlpha('en-US', { ignore: ' ' })
                .withMessage('Mustbe alphabetic')
                .bail()
                .trim(),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
        this.validateDeleteItem = [
            express_validator_1.check('id')
                .exists()
                .withMessage("Not_found")
                .bail()
                .not()
                .isEmpty()
                .withMessage("Empty")
                .bail()
                .isMongoId()
                .withMessage("Not_mongoid")
                .trim(),
            (req, res, next) => {
                utils_1.validate(req, res, next);
            }
        ];
    }
    static getInstance() {
        if (!this.instance) {
            return new CategoryMiddleware();
        }
        return this.instance;
    }
}
exports.default = CategoryMiddleware.getInstance();
