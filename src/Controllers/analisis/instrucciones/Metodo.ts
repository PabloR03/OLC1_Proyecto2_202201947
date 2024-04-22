//import { Instruccion } from "../abstracto/Instruccion";
//import Arbol from "../simbolo/Arbol";
//import tablaSimbolo from "../simbolo/tablaSimbolos";
//import Tipo, { tipoDato } from "../simbolo/Tipo";
//import Errores from "../excepciones/Errores";
//
//
//export default class Metodo extends Instruccion {
//    public id: string
//    public parametros: any[]
//    public instrucciones: Instruccion[]
//    
//    constructor(id: string, tipo:Tipo, instrucciones: Instruccion[], linea: number, col: number, parametros?: any[]) {
//        super(tipo, linea, col)
//        this.id = id
//        this.parametros = parametros ?? []
//        this.instrucciones = instrucciones
//    }
//    
//    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
//        for (let instr of this.instrucciones) {
//            let val = instr.interpretar(arbol, tabla)
//            if (val instanceof Errores) return val
        //}
    //}
//}