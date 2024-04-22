import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Return from "../Transferencia.ts/Return";

export default class Else extends Instruccion {
    private condicion: Instruccion
    private bloque_1: Instruccion[]
    private bloque_2: Instruccion[]
    constructor(condicion: Instruccion, bloque_if: Instruccion[], bloque_else:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.bloque_1 = bloque_if
        this.bloque_2 = bloque_else
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            let error = new Errores("Semántico", "Condición Debe Ser Del Tipo Booleana", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Condición Debe Ser Del Tipo Booleana.\n")
            return error
        }
        let nueva_tabla = new tablaSimbolo(tabla)
        nueva_tabla.setNombre("IF")
        arbol.agregarTabla(nueva_tabla)
        if (condicion) {
            for (let i of this.bloque_1) {
                if(i instanceof Break) return i
                if(i instanceof Continue) return i
                if(i instanceof Return) return i
                if(i instanceof Errores) return i

                let resultado = i.interpretar(arbol, nueva_tabla)

                if(resultado instanceof Break) return resultado
                if(resultado instanceof Continue) return resultado
                if(resultado instanceof Return) return resultado
                if(resultado instanceof Errores) return resultado
            }
        }else{
            if(this.bloque_2){
                for (let i of this.bloque_2) {
                    if(i instanceof Break) return i
                    if(i instanceof Continue) return i
                    if(i instanceof Return) return i
                    if(i instanceof Errores) return i

                    let resultado = i.interpretar(arbol, nueva_tabla)

                    if(resultado instanceof Break) return resultado
                    if(resultado instanceof Continue) return resultado
                    if(resultado instanceof Return) return resultado
                    if(resultado instanceof Errores) return resultado
                }
            }
            
        }
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}