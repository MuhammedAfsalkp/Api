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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const mongoose_1 = require("mongoose");
class db {
    constructor() {
        this.model = mongoose_1.Model;
    }
    getAllItem(query, select, sort) {
        return __awaiter(this, void 0, void 0, function* () {
            query = utils_1.isEmpty(query) ? {} : query;
            select = utils_1.isEmpty(select) ? '-createdAt -updatedAt' : select;
            sort = utils_1.isEmpty(sort) ? null : sort;
            return new Promise((resolve, reject) => {
                this.model.find(query, select, sort, (err, item) => {
                    if (err) {
                        reject(utils_1.buildErrObj(400, err.message));
                    }
                    console.log(item);
                    resolve(item);
                });
            });
        });
    }
    createItem(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // let add:Array<Object>=[body]
                // console.log(add ,"inside db")
                let add = Array.isArray(body) ? body : [body];
                this.model.create(add, { runValidators: true, new: true }, (err, item) => {
                    if (err) {
                        console.log(err.message);
                        reject(utils_1.buildErrObj(400, err.message));
                    }
                    else {
                        console.log("Success", item);
                        resolve(item[0]);
                    }
                });
            });
        });
    }
    getItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.model.findById(id, (err, item) => {
                    utils_1.itemNotFound(err, item, reject, 'NOT-FOUND');
                    resolve(item);
                });
            });
        });
    }
    updateItem(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this.model.findByIdAndUpdate(id, body, { runValidators: true, new: true }, (err, item) => {
                    utils_1.itemNotFound(err, item, reject, 'Not-FOUND');
                    console.log(item);
                    resolve(item);
                });
            }));
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.model.findByIdAndRemove(id, {}, (err, item) => {
                    utils_1.itemNotFound(err, item, reject, 'NOT_FOUND');
                    console.log(item);
                    resolve(utils_1.buildSuccessObject('DELETED'));
                });
            });
        });
    }
    isExist(where) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.model.findOne(where, (err, item) => {
                    if (item || err) {
                        return resolve(true);
                    }
                    else {
                        return resolve(false);
                    }
                });
            });
        });
    }
}
exports.default = db;
