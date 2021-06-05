"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const category_routes_1 = __importDefault(require("./app/category/category.routes"));
const test_routes_1 = __importDefault(require("./app/test/test.routes"));
const routes = (app) => {
    const allRoutes = [];
    allRoutes.push(new category_routes_1.default(app));
    allRoutes.push(new test_routes_1.default(app));
    allRoutes.forEach((val) => {
        console.log(`routes configured for ${val.name}`);
        val.configRoutes();
    });
};
exports.default = routes;
