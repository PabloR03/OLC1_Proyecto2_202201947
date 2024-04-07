"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const indexController_1 = require("../Controllers/indexController");
class router {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', indexController_1.indexController.prueba);
        this.router.post('/post', indexController_1.indexController.metodoPost);
        this.router.post('/analizar', indexController_1.indexController.Analizar);
    }
}
const indexRouter = new router();
exports.default = indexRouter.router;
