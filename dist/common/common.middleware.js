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
const mongoose_1 = require("mongoose");
class CommonMiddleWare {
    constructor() {
        this.model = mongoose_1.Model;
        //correct moddel shoud be assigned correctly from the chils class constructor itself
    }
    checkDuplicate(where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let record = yield this.model.findOne(where);
                if (record) {
                    return Promise.reject('ALREADY_EXISTS');
                }
            }
            catch (e) {
                return Promise.reject('ALREADY_EXISTS');
            }
        });
    }
    isIDExists(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let record = yield this.model.findById(id);
                if (!record) {
                    return Promise.reject('INVALID_ID');
                }
            }
            catch (e) {
                return Promise.reject('INVALID_ID');
            }
        });
    }
    test(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("working", data);
                return Promise.reject("TEST_ERROR");
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = CommonMiddleWare;
