"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class CommonController {
    ok(res, message) {
        res.status(200).json(message);
    }
    serverError(res, message) {
        res.status(500).json(utils_1.buildErrObj(500, message));
    }
    badRequest(res, message) {
        res.status(400).json(utils_1.buildErrObj(400, message));
    }
    unauthorized(res, message) {
        res.status(401).json(utils_1.buildErrObj(401, message));
    }
    notFound(res, message) {
        res.status(404).json(utils_1.buildErrObj(404, message));
    }
    tokenGenerationError(res, message) {
        res.status(228).json(utils_1.buildErrObj(228, message));
    }
}
exports.default = CommonController;
