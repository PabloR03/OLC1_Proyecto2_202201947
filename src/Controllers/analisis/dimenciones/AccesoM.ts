import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Matriz from "../simbolo/SimboloMa";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class AccesoMatriz extends Instruccion {
    private identificador: string
    private posicion_1: Instruccion
    private posicion_2: Instruccion

    constructor(identificador: string, linea: number, col: number, posicion1:Instruccion, posicion2:Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.identificador = identificador
        this.posicion_1 = posicion1
        this.posicion_2 = posicion2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_variable: Matriz = <Matriz> tabla.getMatriz(this.identificador)
        if (valor_variable == null) {
            let error = new Errores("Semántico", "Acceso Matriz Inválido.", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Acceso Matriz Inválido.\n")
            return error 
        }
        let posicion1 = parseInt(this.posicion_1.interpretar(arbol, tabla))
        let posicion2 = parseInt(this.posicion_2.interpretar(arbol, tabla))
        this.tipoDato = valor_variable.getTipo()
        return valor_variable.getValores(posicion1, posicion2)
    }
}