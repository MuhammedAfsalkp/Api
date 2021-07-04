"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env = require('dotenv').config();
const connections_1 = __importDefault(require("./connections"));
const routes_1 = __importDefault(require("./routes"));
class App {
    constructor() {
        this.app = express_1.default();
        this.config();
        console.log(process.env.DB_URL);
        console.log(process.env.PORT);
    }
    config() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(cors_1.default());
        routes_1.default(this.app);
        connections_1.default(this.app);
    }
}
new App();
//export default new App().app
