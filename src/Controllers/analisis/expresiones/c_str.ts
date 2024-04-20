import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Nativo from "../expresiones/Nativo";

export default class FuncionesSTR extends Instruccion {
    private valor_cadena: Instruccion | undefined
    private operacion: Funcion

    constructor(operador: Funcion, linea: number, col: number, valor_cadena: Instruccion) {
        super(new Tipo(tipoDato.CADENA), linea, col)
        this.valor_cadena = valor_cadena
        this.operacion = operador
        
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_unico = null
        if (this.valor_cadena != null) {
            valor_unico = this.valor_cadena.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } 
        switch (this.operacion) {
            case Funcion.C_STR:
                return this.c_str(valor_unico, arbol)
            default:
                let error = new Errores("Semántico", "Función ToLower Inválida", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: Función ToLower Inválida.\n")
                return error
        }
    }

    c_str(valor_cadena: any, arbol:Arbol) {
        let op_unico = this.valor_cadena?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.CADENA:
                this.tipoDato = new Tipo(tipoDato.CARACTER)
                let caracteres = valor_cadena.split("");
                let arreglo: Nativo[] = new Array<Nativo>(caracteres.length);
                for (let i = 0; i < caracteres.length; i++) {
                    arreglo[i] = new Nativo(this.tipoDato, caracteres[i], 0, 0);
                }
                return arreglo
            default:
                let error = new Errores("Semántico", "Función ToLower Inválida", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: Función ToLower Inválida.\n")
                return error
        }
    }
}

export enum Funcion {
    C_STR
}
