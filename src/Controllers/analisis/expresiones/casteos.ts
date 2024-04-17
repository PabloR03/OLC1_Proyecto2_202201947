import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class FuncionCasteo extends Instruccion {
    private operando_izquierda: Instruccion | undefined
    private operando_derecha: Instruccion | undefined
    private operando_unico: Instruccion | undefined
    private operacion: FuncionCast

    constructor(operador: FuncionCast, linea: number, col: number, valor_izquierda: Instruccion, valor_derecha?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, col)
        this.operacion = operador
        if (!valor_derecha) this.operando_unico = valor_izquierda
        else {
            this.operando_izquierda = valor_izquierda
            this.operando_derecha = valor_derecha
        }
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
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
            case FuncionCast.CASTEO:
                return this.casteo(valor_izquierda, valor_derecha)
            default:
                return new Errores("Semantico", "Casteo Invalido", this.linea, this.col)
        }
    }

    casteo(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //ENTERO CON TODOS LOS DEMÁS
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Casteo de Entero Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda)  
                    default:
                        return new Errores("Semántico", "Casteo de Double Inválida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CARACTER)
                        return valor_izquierda.charCodeAt(0)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CARACTER)
                        return parseFloat(valor_izquierda.charCodeAt(0))  
                    default:
                        return new Errores("Semántico", "Casteo de Double Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Potencia Inválida", this.linea, this.col)
        }
    }
}

export enum FuncionCast {
    CASTEO
}