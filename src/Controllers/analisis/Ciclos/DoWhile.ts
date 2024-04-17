import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";

export default class DoWhile extends Instruccion {
    private condicion: Instruccion
    private bloque: Instruccion[]

    constructor(condicion: Instruccion, bloque:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.bloque = bloque
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            let error = new Errores("Semántico", "Condición Debe Ser Del Tipo Booleana", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Condición Debe Ser Del Tipo Booleana")
            return error
        }

        let nueva_tabla = new tablaSimbolo(tabla)
        nueva_tabla.setNombre("DoWhile")

        do {
            for (let ins of this.bloque) {
                if (ins instanceof Break) return;
                if (ins instanceof Continue) break;
            
                let resultado = ins.interpretar(arbol, nueva_tabla)
            
                if (resultado instanceof Break) return;
                if (resultado instanceof Continue) break;
            }
        } while (this.condicion.interpretar(arbol, tabla));
    }
}