import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Return from "../Transferencia.ts/Return";
import Case from "./Case";

export default class Switch extends Instruccion {
    private condicion_switch: Instruccion
    private opcion_case: Case[] | undefined
    private opcion_default: Instruccion | undefined

    constructor(condicion_switch: Instruccion, linea: number, col: number, opcion_case: Case[], opcion_default: Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion_switch = condicion_switch
        this.opcion_case = opcion_case
        this.opcion_default = opcion_default
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let condicion = this.condicion_switch.interpretar(arbol, tabla)
        if(condicion instanceof Errores) return condicion
        if(this.opcion_case != undefined) {
            for(let caso of this.opcion_case) {
                caso.condicional_case = this.condicion_switch
                let resultado = caso.interpretar(arbol, tabla)
                    if( resultado instanceof Errores) return resultado
                    if(resultado instanceof Break) return
                    if(resultado instanceof Return) return resultado
                    if(resultado instanceof Continue){
                        let error = new Errores("Semántico", "La función continue no es parte del switch.", this.linea, this.col)
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La función continue no es parte del switch.\n")
                        return error
                    }
            }
        }
        if(this.opcion_default != undefined) {
            let condicion_default = this.opcion_default.interpretar(arbol, tabla)
            if(condicion_default instanceof Break) return
            if(condicion_default instanceof Return) return condicion_default
            if(condicion_default instanceof Continue){
                let error = new Errores("Semántico", "La función continue no es parte del switch.", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: La función continue no es parte del switch.\n")
                return error
            }
            if( condicion_default instanceof Errores) return condicion_default
        }
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}