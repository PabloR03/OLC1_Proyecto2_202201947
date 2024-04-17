import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";

export default class While extends Instruccion {
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
            return new Errores("Semántico", "Condición Debe Ser Del Tipo Booleana", this.linea, this.col)
        }
        let nueva_tabla = new tablaSimbolo(tabla)
        nueva_tabla.setNombre("While")

        while (this.condicion.interpretar(arbol, tabla)) {
            for (let ins of this.bloque) {
                if (ins instanceof Break) return ins;
                if (ins instanceof Continue) return ins;

                let resultado = ins.interpretar(arbol, nueva_tabla)

                if (resultado instanceof Break) return;
                if (resultado instanceof Continue) break;
                
            }
        }
    }
}