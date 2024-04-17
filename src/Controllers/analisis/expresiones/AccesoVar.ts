import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class AccesoVar extends Instruccion {
    private id: string

    constructor(id: string, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_variable: Simbolo = <Simbolo> tabla.getVariable(this.id)
        if (valor_variable == null){
            let error = new Errores("Semántico", "Acceso Inválido.", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Acceso Inválido.")
            return error 
        }
        this.tipoDato = valor_variable.getTipo()
        return valor_variable.getValor()
    }
}