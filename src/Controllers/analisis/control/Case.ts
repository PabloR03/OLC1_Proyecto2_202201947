//import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Return from "../Transferencia.ts/Return";


export default class Case extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]
    public condicional_case?: Instruccion

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let condicional = this.condicion.interpretar(arbol, tabla)
        if( condicional instanceof Errores) return condicional
        let condicional_case = this.condicional_case?.interpretar(arbol, tabla)
        if( condicional_case instanceof Errores) return condicional_case

        if(this.condicion.tipoDato.getTipo() != this.condicional_case?.tipoDato.getTipo()){
            let error = new Errores("Semántico", "La condición no es del mismo tipo.", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: La condición no es del mismo tipo.\n")
            return error
        }

        if(condicional == condicional_case) {
            let nueva_tabla = new TablaSimbolo(tabla)
            nueva_tabla.setNombre("SentenciaCase")
            arbol.agregarTabla(nueva_tabla)
            
            for(let ins of this.instrucciones) {
                if(ins instanceof Break) return ins
                if(ins instanceof Continue) return ins
                if(ins instanceof Return) return ins
                if(ins instanceof Errores) return ins

                let resultado = ins.interpretar(arbol, nueva_tabla)
                if( resultado instanceof Errores) return resultado

                if(resultado instanceof Break) return resultado
                if(resultado instanceof Continue) return resultado
                if(resultado instanceof Return) return resultado
                if(resultado instanceof Errores) return resultado
            }
        }
    }

    public getCondicion() {
        if( this.condicion instanceof Errores) return this.condicion
        return this.condicion
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}