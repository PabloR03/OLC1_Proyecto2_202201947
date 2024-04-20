import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Arreglo from "../simbolo/SimboloAr";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class AccesoMatriz extends Instruccion {
    private identificador: string
    private posicion_1: Instruccion

    constructor(identificador: string, linea: number, col: number, posicion1:Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.identificador = identificador
        this.posicion_1 = posicion1
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_variable: Arreglo = <Arreglo> tabla.getArreglo(this.identificador)
        if (valor_variable == null) {
            let error = new Errores("Semántico", "Acceso Arreglo Inválido.", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Acceso Arreglo Inválido.\n")
            return error 
        }
        let posicion1 = parseInt(this.posicion_1.interpretar(arbol, tabla))
        this.tipoDato = valor_variable.getTipo()
        return valor_variable.getValores(posicion1)
    }
}