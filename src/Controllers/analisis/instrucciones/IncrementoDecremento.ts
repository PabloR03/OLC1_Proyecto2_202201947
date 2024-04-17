import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class IncrementoDeremento extends Instruccion {
    constructor(private operando: string, linea: number, col: number, private operando_unico: string) {
        super(new Tipo(tipoDato.VOID), linea, col);
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_variable = tabla.getVariable(this.operando_unico.toLocaleLowerCase());
        if (!valor_variable) {
            let error = new Errores("Semántico", "La Variable No Existe.", this.linea, this.col)
            arbol.agregarError(error)
            arbol.setConsola("Semántico: La Variable No Existe.")
            return error
        }

        let tipo = valor_variable.getTipo().getTipo();
        if (tipo != tipoDato.ENTERO && tipo != tipoDato.DECIMAL) {
            let error = new Errores("Semántico", "No Se Puede Aplicar El Incremeneto o Decremento.", this.linea, this.col);
            arbol.agregarError(error)
            arbol.setConsola("Semántico: No Se Puede Aplicar El Incremeneto o Decremento.")
            return error
        }

        let incremento = this.operando == "INCREMENTO" ? 1 : this.operando == "DECREMENTO" ? -1 : null;
        if (incremento === null) {
            let error = new Errores("Semántico", "Error En Incremento o Decremento.", this.linea, this.col);
            arbol.agregarError(error)
            arbol.setConsola("Semántico: Error En Incremento o Decremento.")
            return error
        }

        let valor = tipo == tipoDato.ENTERO ? parseInt(valor_variable.getValor()) : parseFloat(valor_variable.getValor());
        valor_variable.setValor(valor + incremento);
    }
}
