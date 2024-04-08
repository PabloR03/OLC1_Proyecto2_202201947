"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
const Arbol_1 = __importDefault(require("./analisis/simbolo/Arbol"));
const tablaSimbolos_1 = __importDefault(require("./analisis/simbolo/tablaSimbolos"));
class controller {
    prueba(req, res) {
        res.json({ "funciona": "la api" });
    }
    interpretar(req, res) {
        try {
            let parser = require('./analisis/analizador');
            let ast = new Arbol_1.default(parser.parse(req.body.entrada));
            let tabla = new tablaSimbolos_1.default();
            tabla.setNombre("Ejemplo1");
            ast.setTablaGlobal(tabla);
            ast.setConsola("");
            for (let i of ast.getInstrucciones()) {
                console.log(i);
                var resultado = i.interpretar(ast, tabla);
                console.log(resultado);
            }
            res.send({ "Respuesta": "Si sale compi1" });
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "Ya no sale compi1" });
        }
    }
}
exports.indexController = new controller();
