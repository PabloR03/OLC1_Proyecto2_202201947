import path from 'path';
import { Request, Response } from 'express';
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Metodo from './analisis/instrucciones/Metodo';
//import Metodo from './analisis/Metodoss/metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Run from './analisis/instrucciones/Run';


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
                if (i instanceof Run){
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
    }



export const indexController = new controller();