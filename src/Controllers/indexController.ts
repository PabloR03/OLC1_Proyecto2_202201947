import path from 'path';
import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
//import Metodo from './analisis/instrucciones/Metodo';
//import Metodo from './analisis/Metodoss/metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Metodo from './analisis/Metodoss/metodo';
import Execute from './analisis/Metodoss/execute';
import { exec } from 'child_process';

//import Run from './analisis/instrucciones/Run';
export let lista_errores: Array<Errores>

import DeclaracionArreglo from './analisis/dimenciones/DeclaracionA';
import DeclaracionMatriz from './analisis/dimenciones/DeclaracionM';
import * as fs from 'fs';
import Errores from './analisis/excepciones/Errores';
import Singleton from './analisis/simbolo/singleton';


var ast_dot : string
class controller {
    public prueba(req: Request, res: Response) {
        res.json({ "funciona": "la api" });
    }

    public interpretar(req: Request, res: Response) {
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Ejemplo1")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            //for (let i of ast.getInstrucciones()) {
            //    //console.log(i)
            //    var resultado = i.interpretar(ast, tabla)
            //    //console.log(resultado)
            //}
            let execute = null;
            for (let i of ast.getInstrucciones()) {
                if (i instanceof Metodo) {
                    i.id = i.id.toLocaleLowerCase()
                    ast.addFunciones(i)
                }
                if(i instanceof Declaracion){
                    i.interpretar(ast, tabla)
                    // manejo de errores
                }
                if(i instanceof DeclaracionArreglo){
                    i.interpretar(ast, tabla)
                    // manejo de errores
                }
                if(i instanceof DeclaracionMatriz){
                    i.interpretar(ast, tabla)
                    // manejo de errores
                }
                if (i instanceof Execute){
                    execute = i
                }
            }
            
            if(execute != null){
                console.log("Ejecutando funcion")
                execute.interpretar(ast,tabla)
                //manejo de errores

            }
            console.log(tabla)
            res.send({ "Respuesta": ast.getConsola() })
        } catch (err: any) {
            console.log(err)
            res.send({ "Error": "REVISAR LA ENTRADA" })
        }
    }
    public rerrores(req: Request, res: Response) {
        try {
            let parser = require('./analisis/analizador')
            let ArbolAst = new Arbol(parser.parse(req.body.entrada))
            let Tabla_Simbolos = new tablaSimbolo()
            Tabla_Simbolos.setNombre("Tabla Global")
            ArbolAst.setTablaGlobal(Tabla_Simbolos)
            ArbolAst.agregarTabla(Tabla_Simbolos)
            ArbolAst.setConsola("")
            for (let i of ArbolAst.getInstrucciones()) {
                var resultado = i.interpretar(ArbolAst, Tabla_Simbolos)
            }
            ArbolAst.generarReporteErrores()
            res.sendFile(path.resolve('REPORTE_ERRORES.html'));
        } catch (err: any) {
            console.log(err)
            res.send({ "Error": "Error Al Generar Reporte De Errores." })
        }
    }

    public rtablasimbolos(req: Request, res: Response) {
        try {
            let parser = require('./analisis/analizador')
            let ArbolAst = new Arbol(parser.parse(req.body.entrada))
            let Tabla_Simbolos = new tablaSimbolo()
            Tabla_Simbolos.setNombre("Tabla Global")
            ArbolAst.setTablaGlobal(Tabla_Simbolos)
            ArbolAst.agregarTabla(Tabla_Simbolos)
            ArbolAst.setConsola("")
            for (let i of ArbolAst.getInstrucciones()) {
                var resultado = i.interpretar(ArbolAst, Tabla_Simbolos)
            }
            ArbolAst.generarReporteTablas()
            res.sendFile(path.resolve('TABLA_SIMBOLOS.html'));
        } catch (err: any) {
            console.log(err)
            res.send({ "Error": "Error Al Generar Reporte De Tablas De Simbolos." })
        }
    }

    public rarbolast(req: Request, res: Response) {
        try {
            ast_dot=""
            let parser = require('./analisis/analizador')
            let Arbol_Ast = new Arbol(parser.parse(req.body.entrada))
            let Nueva_Tabla = new tablaSimbolo()
            Nueva_Tabla.setNombre("Tabla Global")
            Arbol_Ast.setTablaGlobal(Nueva_Tabla)
            Arbol_Ast.agregarTabla(Nueva_Tabla)
            
            let contador = Singleton.getInstancia()
            let dot = "digraph ast{\n"
            dot += "node [\n"
            dot += "shape = Msquare\n"
            dot += "style = filled\n"
            dot += "]\n"
            dot += "nINICIO[label=\"INICIO\"];\n"
            dot += "nINSTRUCCIONES[label=\"INSTRUCCIONES\"];\n"
            dot += "nINICIO->nINSTRUCCIONES;\n"
            for (let i of Arbol_Ast.getInstrucciones()) {
                if (i instanceof Errores) continue
                let nodo = `n${contador.getCount()}`
                dot += `${nodo}[label=\"INSTRUCCION\"];\n`
                dot += `nINSTRUCCIONES->${nodo};\n`
                dot += i.obtener_ast(nodo)
            }
            dot += "\n}"
        ast_dot = dot
        fs.writeFileSync('ARBOL_AST.dot', dot);
        exec('dot -Tpdf ARBOL_AST.dot -o ARBOL_AST.pdf', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            res.sendFile(path.resolve('ARBOL_AST.pdf'));
        });
        } catch (err: any) {
            res.send({ "Error": "Error Al Generar Reporte." })
        }
    }
    }



export const indexController = new controller();