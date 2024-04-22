import { Instruccion } from "../abstracto/Instruccion";
import Case from "../control/Case";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class FuncionesRound extends Instruccion {
    private operando_unico: Instruccion | undefined
    private operacion: Funcion

    constructor(operador: Funcion, linea: number, col: number, op_izquierda: Instruccion) {
        super(new Tipo(tipoDato.DECIMAL), linea, col)
        this.operando_unico = op_izquierda
        this.operacion = operador
        
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_unico = null
        if (this.operando_unico != null) {
            valor_unico = this.operando_unico.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } 
        switch (this.operacion) {
            case Funcion.TOROUND:
                return this.round(valor_unico)
            case Funcion.TOLOWER:
                return this.tolower(valor_unico)
            case Funcion.TOSTRING:
                return this.tostring(valor_unico)
            case Funcion.TOUPPER:
                return this.toupper(valor_unico)
            case Funcion.TYPEOF:
                return this.typeof()
            default:
                return new Errores("Semántico", "Función Round Inválida", this.linea, this.col)
        }
    }

    round(op_izquierda: any) {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                let numero = parseFloat(op_izquierda)
                return Math.round(numero)
            default:
                return new Errores("Semántico", "Función Round Inválida", this.linea, this.col)
        }
    }

    tolower(op_izquierda: any) {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda.toLowerCase())
            default:
                return new Errores("Semántico", "Función ToLower Inválida", this.linea, this.col)
        }
    }

    tostring(op_izquierda: any) {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda)
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda)
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda)
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda)
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda)
            default:
                return new Errores("Semántico", "Función ToString Inválida", this.linea, this.col)
        }
    }

    toupper(op_izquierda: any) {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CADENA)
                return String(op_izquierda.toUpperCase())
            default:
                return new Errores("Semantico", "Función ToUpper Inválida", this.linea, this.col)
        }
    }

    typeof() {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.ENTERO:
                return 'Int'
            case tipoDato.DECIMAL:
                return 'Double'
            case tipoDato.BOOL:
                return 'Boole'
            case tipoDato.CARACTER:
                return 'Char'
            case tipoDato.CADENA:
                return 'String'
            default:
                return new Errores("Semántico", "Función TypeOf Inválida", this.linea, this.col)
        }
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}


export enum Funcion {
    TOROUND,
    TOLOWER,
    TOSTRING,
    TOUPPER,
    TYPEOF
}