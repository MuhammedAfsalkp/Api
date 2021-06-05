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
const category_service_1 = __importDefault(require("./category.service"));
const category_service_2 = __importDefault(require("./category.service"));
const utils_1 = require("../../common/utils");
const express_validator_1 = require("express-validator");
class CategoryContoller extends common_controller_1.default {
    constructor() {
        super();
        this.getAllItems = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.query);
                const query = req.query;
                const select = { name: 1 };
                const sort = { sort: { name: 1 }, limit: 3 };
                this.ok(res, yield category_service_2.default.getAllItem(query, select, sort));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
        this.getItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params);
                let params = express_validator_1.matchedData(req);
                console.log(params);
                let id = yield utils_1.isIdGood(params.id);
                console.log("Good id");
                this.ok(res, yield category_service_2.default.getItem(id));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
        this.createItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body);
                let body = express_validator_1.matchedData(req);
                this.ok(res, yield category_service_2.default.createItem(body));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
        this.updateItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.params.id);
                let body = express_validator_1.matchedData(req);
                let id = yield utils_1.isIdGood(body.id);
                this.ok(res, yield category_service_1.default.updateItem(id, body));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
        this.deleteItem = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let params = express_validator_1.matchedData(req);
                console.log(params);
                let id = yield utils_1.isIdGood(params.id);
                this.ok(res, yield category_service_2.default.deleteItem(id));
            }
            catch (err) {
                this.serverError(res, err);
            }
        });
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CategoryContoller();
        }
        return this.instance;
    }
}
exports.default = CategoryContoller.getInstance();
