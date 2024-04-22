import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Return from "../Transferencia.ts/Return";

export default class Default extends Instruccion {
    private instrucciones: Instruccion[]

    constructor(instrucciones: Instruccion[], fila: number, columna: number) {
        super(new Tipo(tipoDato.VOID), fila, columna)
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        
        let nueva_tabla = new TablaSimbolo(tabla)
        nueva_tabla.setNombre("SentenciaDefault")
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
    obtener_ast(anterior: string): string {
        return ""
    }
}