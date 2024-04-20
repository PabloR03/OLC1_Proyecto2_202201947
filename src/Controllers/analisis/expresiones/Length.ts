import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class FuncionesLenght extends Instruccion {
    private valor: Instruccion
    private operacion: Funcion

    constructor(operador: Funcion, linea: number, col: number, valor: Instruccion) {
        super(new Tipo(tipoDato.CADENA), linea, col)
        this.valor = valor
        this.operacion = operador
        
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_unico = null
        if (this.valor != null) {
            valor_unico = this.valor.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } 
        switch (this.operacion) {
            case Funcion.LENGTH:
                return this.length(valor_unico, arbol)
            default:
                let error = new Errores("Semántico", "Función Length Inválida", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: Función Length Inválida ACA.\n")
                return error
        }
    }

    length(valor: any, arbol:Arbol) {
        let op_unico = this.valor?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor.length)
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor.length)
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor.length)
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor.length)
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor.length)
            default:
                let error = new Errores("Semántico", "Función Length Inválida", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: Función Length Inválida PROANDO.\n")
                return error
        }
    }
}

export enum Funcion {
    LENGTH
}