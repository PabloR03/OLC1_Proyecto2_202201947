import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Continue extends Instruccion {
    constructor(linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }
}
