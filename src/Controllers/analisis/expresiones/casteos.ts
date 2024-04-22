import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Casteo extends Instruccion {

    private operandoUnico: Instruccion | undefined
    private tipoD: Tipo

    constructor(operador: Tipo, linea: number, col: number, operando: Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.tipoD = operador
        this.operandoUnico = operando
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let expresion = this.operandoUnico?.interpretar(arbol, tabla)
        switch (this.tipoD.getTipo()) {
            case tipoDato.ENTERO:
                return this.castearEntero(expresion);
            case tipoDato.DECIMAL:
                return this.castearDouble(expresion);
            case tipoDato.CARACTER:
                return this.castearCaracter(expresion);
            case tipoDato.CADENA:
                return this.castearCadena(expresion);
        }
    }

    castearEntero(operando: any) {
        let tipo = this.operandoUnico?.tipoDato.getTipo();
        switch (tipo) {
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.ENTERO);
                return parseInt(operando);
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.ENTERO);
                return parseInt(operando.charCodeAt(0));
            default:
                return new Errores("Error Semantico", "No se puede castear el valor", this.linea, this.col)
        }

    }

    castearDouble(operando: any) {
        let tipo = this.operandoUnico?.tipoDato.getTipo();
        switch (tipo) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.DECIMAL);
                return parseFloat(operando);
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.DECIMAL);
                return parseFloat(operando.charCodeAt(0));
            default:
                return new Errores("Error Semantico", "No se puede castear el valor", this.linea, this.col)
        }
    }

    castearCaracter(operando: any) {
        let tipo = this.operandoUnico?.tipoDato.getTipo();
        switch (tipo) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CARACTER);
                return String.fromCharCode(parseInt(operando));
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.CARACTER);
                return String.fromCharCode(parseFloat(operando));
            default:
                return new Errores("Error Semantico", "No se puede castear el valor", this.linea, this.col)
        }
    }

    castearCadena(operando: any) {
        let tipo = this.operandoUnico?.tipoDato.getTipo();
        switch (tipo) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.CADENA);
                return parseInt(operando).toString();
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.CADENA);
                return parseFloat(operando).toString();
            case tipoDato.CARACTER:
                this.tipoDato = new Tipo(tipoDato.CADENA);
                return operando.toString();
            default:
                return new Errores("Error Semantico", "No se puede castear el valor", this.linea, this.col)
        }
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}