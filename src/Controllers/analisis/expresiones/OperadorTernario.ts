/*import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Operadores_Ternarios extends Instruccion {
    private valor_izquierda: Instruccion | undefined
    private valor_central: Instruccion | undefined
    private valor_derecha: Instruccion | undefined
    private operando_unico: Instruccion | undefined
    private operacion: OperadoresTernarios

    constructor(operador: OperadoresTernarios, linea: number, col: number, valor_izquierda: Instruccion, valor_central?: Instruccion, valor_derecha?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, col)
        this.operacion = operador
        if (!valor_derecha) this.operando_unico = valor_izquierda
        else {
            this.valor_izquierda = valor_izquierda
            this.valor_central = valor_central
            this.valor_derecha = valor_derecha
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_izquierda,valor_central, valor_derecha, valor_unico = null
        if (this.operando_unico != null) {
            valor_unico = this.operando_unico.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } else {
            valor_izquierda = this.valor_izquierda?.interpretar(arbol, tabla)
            if (valor_izquierda instanceof Errores) return valor_izquierda
            valor_central = this.valor_central?.interpretar(arbol, tabla)
            if (valor_central instanceof Errores) return valor_central
            valor_derecha = this.valor_derecha?.interpretar(arbol, tabla)
            if (valor_derecha instanceof Errores) return valor_derecha
        }

        switch (this.operacion) {
            case OperadoresTernarios.TERNARIO:
                return this.ternarios(valor_izquierda, valor_central, valor_derecha)
            default:
                return new Errores("Semantico", "Operador Ternario Invalido", this.linea, this.col)
        }
    }


    //ternarios(valor_izquierda: any, valor_central: any, valor_derecha: any) {
    //    if (valor_izquierda === valor_central) 
    //        {
    //            return valor_central
    //    }
    //    else
    //    return valor_derecha
    //    
    //}
    ternarios(valor_izquierda: any, valor_central:any, valor_derecha: any) {
        let tipo1 = this.valor_izquierda?.tipoDato.getTipo()
        let tipo2 = this.valor_central?.tipoDato.getTipo()
        let tipo3 = this.valor_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                if (valor_izquierda == true) {
                    return valor_central
                } else {
                    return valor_derecha
                }
            }
        }
    }

export enum OperadoresTernarios {
    TERNARIO
}



            if (valor_izquierda && valor_derecha) {
                return valor_derecha
            } else {
                //el not es para negar el valor, se establece con el simbolo !
                return !valor_derecha
            }
        }
        if (valor_izquierda === false) {
            if (valor_izquierda && !valor_derecha) {
                return !valor_derecha
            } else {
                return valor_derecha
            


*/