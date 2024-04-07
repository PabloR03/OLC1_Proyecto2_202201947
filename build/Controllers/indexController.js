"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
class controller {
    prueba(req, res) {
        res.json('Hello World');
    }
    metodoPost(req, res) {
        console.log(req.body);
        console.log(req.body.notas);
        res.json({ message: 'Metodo Post' });
    }
}
exports.indexController = new controller();
