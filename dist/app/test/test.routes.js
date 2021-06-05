"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_routes_1 = __importDefault(require("../../common/common.routes"));
class TestRoutes extends common_routes_1.default {
    constructor(app) {
        super(app, 'testroutes');
    }
    configRoutes() {
        console.log("Test routes Working");
        this.app.get('/test', (req, res) => {
            res.status(200).send("Updatingg");
        });
        // return this.app;
    }
}
exports.default = TestRoutes;
