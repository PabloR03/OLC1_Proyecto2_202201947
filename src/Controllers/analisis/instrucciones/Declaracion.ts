import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class Declaracion extends Instruccion {
    private id: string[]
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, col: number, id: string[], valor: Instruccion) {
        super(tipo, linea, col)
        this.id = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_variable;
        this.id.forEach((elemento) => {
            if(this.valor === null){
                valor_variable= this.valor_defecto(this.tipoDato)
            }else{
                valor_variable = this.valor.interpretar(arbol, tabla)
                if (valor_variable instanceof Errores) return valor_variable
                if ((valor_variable.toLowerCase()  == "true" || valor_variable.toLowerCase()  == "false") && this.tipoDato.getTipo() == tipoDato.ENTERO) {
                    valor_variable = valor_variable.toLowerCase() == "true" ? 1 : 0;
                }else if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                    return new Errores("SEMANTICO", "Error Al Declarar Variable.", this.linea, this.col)
                }
            }
            if (this.tipoDato.getTipo() == tipoDato.ENTERO) {
                if (parseInt(valor_variable) < -2147483648 || parseInt(valor_variable) > 2147483647) {
                    return new Errores("SEMANTICO", "Variable Fuera De Rango.", this.linea, this.col);
                }
            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, valor_variable))){
                return new Errores("SEMANTICO", "La Variable Ya Existe.", this.linea, this.col)
            }
        });
    }

    private valor_defecto(tipo: Tipo): any {
        switch (tipo.getTipo()) {
            case tipoDato.ENTERO:
                return "0"
            case tipoDato.DECIMAL:
                return "0.0"
            case tipoDato.BOOL:
                return 'true'
            case tipoDato.CARACTER:
                return ''
            case tipoDato.CADENA:
                return ""
            default:
                return null
        }
    }

}