"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
const path_1 = __importDefault(require("path"));
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
                //console.log(i)
                var resultado = i.interpretar(ast, tabla);
                //console.log(resultado)
            }
            console.log(tabla);
            res.send({ "Respuesta": ast.getConsola() });
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "REVISAR LA ENTRADA" });
        }
    }
    reporteErrores(req, res) {
        try {
            let parser = require('./analisis/analizador');
            let ArbolAst = new Arbol_1.default(parser.parse(req.body.entrada));
            let Tabla_Simbolos = new tablaSimbolos_1.default();
            Tabla_Simbolos.setNombre("Ejemplo1");
            ArbolAst.setTablaGlobal(Tabla_Simbolos);
            ArbolAst.setConsola("");
            for (let i of ArbolAst.getInstrucciones()) {
                var resultado = i.interpretar(ArbolAst, Tabla_Simbolos);
            }
            ArbolAst.generarReporteErrores();
            res.sendFile(path_1.default.resolve('reporteErrores.html'));
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "Hubo un error al generar el reporte de errores" });
        }
    }
}
exports.indexController = new controller();
