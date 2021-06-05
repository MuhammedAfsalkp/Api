"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemNotFound = exports.isEmpty = exports.isIdGood = exports.validate = exports.buildSuccessObject = exports.buildErrObj = exports.handleError = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_validator_1 = require("express-validator");
function handleError(res, message) {
    res.status(message.code).json(message);
}
exports.handleError = handleError;
function buildErrObj(code, message) {
    return {
        code,
        message
    };
}
exports.buildErrObj = buildErrObj;
function buildSuccessObject(message) {
    return {
        message
    };
}
exports.buildSuccessObject = buildSuccessObject;
function validate(req, res, next) {
    try {
        express_validator_1.validationResult(req).throw();
        console.log("Validation complete without any error");
        return next();
    }
    catch (err) {
        const error = err.array();
        console.log(error);
        let e = {};
        error.forEach((val) => {
            let field = val.param;
            e[field] = [val.msg];
        });
        return handleError(res, buildErrObj(400, e));
    }
}
exports.validate = validate;
function isIdGood(id) {
    return new Promise((resolve, reject) => {
        const good = mongoose_1.default.Types.ObjectId.isValid(id);
        return good ? resolve(id) : reject(buildErrObj(400, 'id malformed'));
    });
}
exports.isIdGood = isIdGood;
function isEmpty(value) {
    {
        return (value === undefined || value === null || (typeof value === 'object' && Object.keys(value).length === 0)
            || (typeof value === 'string' && value.trim().length === 0));
    }
}
exports.isEmpty = isEmpty;
function itemNotFound(err, item, reject, message) {
    if (err) {
        reject(buildErrObj(400, err.message));
    }
    if (!item || item == null) {
        reject(buildErrObj(400, 'NOT_FOUNd'));
    }
}
exports.itemNotFound = itemNotFound;
