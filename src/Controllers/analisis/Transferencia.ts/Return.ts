import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Return extends Instruccion {
    private exp?: Instruccion
    public valor = null

    constructor(linea: number, columna: number, exp?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, columna)
        this.exp = exp
    }
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if(this.exp){
        this.valor = this.exp. interpretar(arbol, tabla)
        this.tipoDato = this.exp.tipoDato
    }
    return this
}
}