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
}
exports.default = CommonController;
