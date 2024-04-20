import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Arreglo from "../simbolo/SimboloAr";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class DeclaracionArreglo extends Instruccion {
    private identificador: string
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, col: number, identificador: string , valor: Instruccion) {
        super(tipo, linea, col)
        this.identificador = identificador
        this.valor = valor
    }
    
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let arreglo = this.valor.interpretar(arbol, tabla)
        if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, arreglo))){
            let error = new Errores("Semántico", "Error Al Declarar Arreglo.", this.linea, this.col);
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Error Al Declarar Arreglo.\n")
            return error
        }
    }
}