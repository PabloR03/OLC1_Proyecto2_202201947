import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Aritmeticas extends Instruccion {
    private operando_izquierda: Instruccion | undefined
    private operando_derecha: Instruccion | undefined
    private operando_unico: Instruccion | undefined
    private operacion: Operadores

    constructor(operador: Operadores, linea: number, col: number, op_izquierda: Instruccion, op_derecha?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, col)
        this.operacion = operador
        if (!op_derecha) this.operando_unico = op_izquierda
        else {
            this.operando_izquierda = op_izquierda
            this.operando_derecha = op_derecha
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_izquierda, valor_derecha, valor_unico = null
        if (this.operando_unico != null) {
            valor_unico = this.operando_unico.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } else {
            valor_izquierda = this.operando_izquierda?.interpretar(arbol, tabla)
            if (valor_izquierda instanceof Errores) return valor_izquierda
            valor_derecha = this.operando_derecha?.interpretar(arbol, tabla)
            if (valor_derecha instanceof Errores) return valor_derecha
        }

        switch (this.operacion) {
            case Operadores.SUMA:
                return this.suma(valor_izquierda, valor_derecha)
            case Operadores.RESTA:
                return this.resta(valor_izquierda, valor_derecha)
            case Operadores.NEG:
                return this.negacion(valor_unico)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    suma(op_izquierda: any, op_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op_izquierda) + parseInt(op_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) + parseFloat(op_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (op_derecha.toLowerCase() === "true") {
                            return parseInt(op_izquierda) + 1;
                        } else if (op_derecha.toLowerCase() === "false") {
                            return parseInt(op_izquierda);
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op_izquierda) + parseInt(op_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return op_izquierda + op_derecha
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) + parseFloat(op_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) + parseFloat(op_derecha)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
        }

    }

    resta(op_izquierda: any, op_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op_izquierda) - parseInt(op_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) - parseFloat(op_derecha)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) - parseFloat(op_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(op_izquierda) - parseFloat(op_derecha)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
        }
    }

    negacion(op_izquierda: any) {
        let opU = this.operando_unico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(op_izquierda) * -1
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(op_izquierda) * -1
            default:
                return new Errores("Semantico", "Negacion Unaria invalida", this.linea, this.col)
        }
    }

}

export enum Operadores {
    SUMA,
    RESTA,
    NEG
}