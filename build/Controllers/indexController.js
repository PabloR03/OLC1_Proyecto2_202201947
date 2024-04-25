"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexController = exports.lista_errores = void 0;
const path_1 = __importDefault(require("path"));
const Arbol_1 = __importDefault(require("./analisis/simbolo/Arbol"));
const tablaSimbolos_1 = __importDefault(require("./analisis/simbolo/tablaSimbolos"));
//import Metodo from './analisis/instrucciones/Metodo';
//import Metodo from './analisis/Metodoss/metodo';
const Declaracion_1 = __importDefault(require("./analisis/instrucciones/Declaracion"));
const metodo_1 = __importDefault(require("./analisis/Metodoss/metodo"));
const execute_1 = __importDefault(require("./analisis/Metodoss/execute"));
const child_process_1 = require("child_process");
const DeclaracionA_1 = __importDefault(require("./analisis/dimenciones/DeclaracionA"));
const DeclaracionM_1 = __importDefault(require("./analisis/dimenciones/DeclaracionM"));
const fs = __importStar(require("fs"));
const Errores_1 = __importDefault(require("./analisis/excepciones/Errores"));
const singleton_1 = __importDefault(require("./analisis/simbolo/singleton"));
var ast_dot;
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
                if (i instanceof metodo_1.default) {
                    i.id = i.id.toLocaleLowerCase();
                    ast.addFunciones(i);
                }
                if (i instanceof Declaracion_1.default) {
                    i.interpretar(ast, tabla);
                    // manejo de errores
                }
                if (i instanceof DeclaracionA_1.default) {
                    i.interpretar(ast, tabla);
                    // manejo de errores
                }
                if (i instanceof DeclaracionM_1.default) {
                    i.interpretar(ast, tabla);
                    // manejo de errores
                }
                if (i instanceof execute_1.default) {
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
    rerrores(req, res) {
        try {
            let parser = require('./analisis/analizador');
            let ArbolAst = new Arbol_1.default(parser.parse(req.body.entrada));
            let Tabla_Simbolos = new tablaSimbolos_1.default();
            Tabla_Simbolos.setNombre("Tabla Global");
            ArbolAst.setTablaGlobal(Tabla_Simbolos);
            ArbolAst.agregarTabla(Tabla_Simbolos);
            ArbolAst.setConsola("");
            for (let i of ArbolAst.getInstrucciones()) {
                var resultado = i.interpretar(ArbolAst, Tabla_Simbolos);
            }
            ArbolAst.generarReporteErrores();
            res.sendFile(path_1.default.resolve('REPORTE_ERRORES.html'));
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "Error Al Generar Reporte De Errores." });
        }
    }
    rtablasimbolos(req, res) {
        try {
            let parser = require('./analisis/analizador');
            let ArbolAst = new Arbol_1.default(parser.parse(req.body.entrada));
            let Tabla_Simbolos = new tablaSimbolos_1.default();
            Tabla_Simbolos.setNombre("Tabla Global");
            ArbolAst.setTablaGlobal(Tabla_Simbolos);
            ArbolAst.agregarTabla(Tabla_Simbolos);
            ArbolAst.setConsola("");
            for (let i of ArbolAst.getInstrucciones()) {
                var resultado = i.interpretar(ArbolAst, Tabla_Simbolos);
            }
            ArbolAst.generarReporteTablas();
            res.sendFile(path_1.default.resolve('TABLA_SIMBOLOS.html'));
        }
        catch (err) {
            console.log(err);
            res.send({ "Error": "Error Al Generar Reporte De Tablas De Simbolos." });
        }
    }
    rarbolast(req, res) {
        try {
            ast_dot = "";
            let parser = require('./analisis/analizador');
            let Arbol_Ast = new Arbol_1.default(parser.parse(req.body.entrada));
            let Nueva_Tabla = new tablaSimbolos_1.default();
            Nueva_Tabla.setNombre("Tabla Global");
            Arbol_Ast.setTablaGlobal(Nueva_Tabla);
            Arbol_Ast.agregarTabla(Nueva_Tabla);
            let contador = singleton_1.default.getInstancia();
            let dot = "digraph ast{\n";
            dot += "node [\n";
            dot += "shape = Msquare\n";
            dot += "style = filled\n";
            dot += "]\n";
            dot += "nINICIO[label=\"INICIO\"];\n";
            dot += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n";
            dot += "nINICIO->nINSTRUCCIONES;\n";
            for (let i of Arbol_Ast.getInstrucciones()) {
                if (i instanceof Errores_1.default)
                    continue;
                let nodo = `n${contador.getCount()}`;
                dot += `${nodo}[label=\"INSTRUCCION\"];\n`;
                dot += `nINSTRUCCIONES->${nodo};\n`;
                dot += i.obtener_ast(nodo);
            }
            dot += "\n}";
            ast_dot = dot;
            fs.writeFileSync('ARBOL_AST.dot', dot);
            (0, child_process_1.exec)('dot -Tpdf ARBOL_AST.dot -o ARBOL_AST.pdf', (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
                res.sendFile(path_1.default.resolve('ARBOL_AST.pdf'));
            });
        }
        catch (err) {
            res.send({ "Error": "Error Al Generar Reporte." });
        }
    }
}
exports.indexController = new controller();
