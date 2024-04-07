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
    Analizar(req, res) {
        try {
            let parser = require('./analizador.js');
            let resultado = parser.parse(req.body.texto);
            res.json({ message: resultado });
        }
        catch (e) {
            res.json({ message: "Error" });
            console.log(e);
        }
    }
}
exports.indexController = new controller();
