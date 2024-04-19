"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = void 0;
const Arbol_1 = __importDefault(require("./analisis/simbolo/Arbol"));
const tablaSimbolos_1 = __importDefault(require("./analisis/simbolo/tablaSimbolos"));
const Metodo_1 = __importDefault(require("./analisis/instrucciones/Metodo"));
const Declaracion_1 = __importDefault(require("./analisis/instrucciones/Declaracion"));
const Run_1 = __importDefault(require("./analisis/instrucciones/Run"));
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
            //for (let i of ast.getInstrucciones()) {
            //    //console.log(i)
            //    var resultado = i.interpretar(ast, tabla)
            //    //console.log(resultado)
            //}
            let execute = null;
            for (let i of ast.getInstrucciones()) {
                if (i instanceof Metodo_1.default) {
                    i.id = i.id.toLocaleLowerCase();
                    ast.addFunciones(i);
                }
                if (i instanceof Declaracion_1.default) {
                    i.interpretar(ast, tabla);
                    // manejo de errores
                }
                if (i instanceof Run_1.default) {
                    execute = i;
                }
            }
            if (execute != null) {
                console.log("Ejecutando funcion");
                execute.interpretar(ast, tabla);
                //manejo de errores
            }
            console.log(tabla);
            res.send({ "Respuesta": ast.getConsola() });
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "REVISAR LA ENTRADA" });
        }
    }
}
exports.indexController = new controller();
