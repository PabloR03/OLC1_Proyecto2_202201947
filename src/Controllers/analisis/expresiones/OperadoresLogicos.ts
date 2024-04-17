import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class OperadoresLogicos extends Instruccion {
    private valor_izquierda: Instruccion | undefined;
    private valor_derecha: Instruccion | undefined;
    private operacion: OperadorLogico;
    private opUnico: Instruccion | undefined

    constructor(operacion: OperadorLogico, linea: number, col: number, valor_izquierda: Instruccion, valor_derecha: Instruccion) {
        super(new Tipo(tipoDato.BOOL), linea, col);
        this.operacion = operacion;
        if (!valor_derecha) this.opUnico = valor_izquierda
        else {
            this.valor_derecha = valor_derecha
            this.valor_izquierda = valor_izquierda
        }
    }


    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_izquierda, valor_derecha, opUnico  = null;

        if (this.opUnico != null) {
            opUnico = this.opUnico.interpretar(arbol, tabla);
            if (opUnico instanceof Errores) return opUnico
        }else {
            valor_izquierda = this.valor_izquierda?.interpretar(arbol, tabla)
            if (valor_izquierda instanceof Errores) return valor_izquierda
            valor_derecha = this.valor_derecha?.interpretar(arbol, tabla)
            if (valor_derecha instanceof Errores) return valor_derecha
        }

        switch (this.operacion) {
            case OperadorLogico.O_OR:
                return this.or(valor_izquierda, valor_derecha);
            case OperadorLogico.O_AND:
                return this.and(valor_izquierda, valor_derecha);
            case OperadorLogico.O_NOT:
                return this.not(opUnico);
            default:
                return new Errores("Semantico", "Funcion Invalida", this.linea, this.col);
        }
    }

    or(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.valor_izquierda?.tipoDato.getTipo()
        let tipo2 = this.valor_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return valor_izquierda || valor_derecha
                    default:
                        return new Errores("Semántico", "Operación Or Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Or Inválida", this.linea, this.col)
        }
    }

    and(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.valor_izquierda?.tipoDato.getTipo()
        let tipo2 = this.valor_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return valor_izquierda && valor_derecha
                    default:
                        return new Errores("Semántico", "Operación And Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación And Inválida", this.linea, this.col)
        }
    }

    not(valor_unico: any) {
        let op_unico = this.opUnico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.BOOL)
                return !valor_unico
            default:
                return new Errores("Semántico", "Operación Not Inválida", this.linea, this.col)
        }
    }
}

export enum OperadorLogico {
    O_OR,
    O_AND,
    O_NOT
}
