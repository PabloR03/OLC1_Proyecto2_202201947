import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Matriz from "../simbolo/SimboloMa";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class AsignacionMatriz extends Instruccion {
    private identificador: string
    private expresion: Instruccion
    private posicion_1: Instruccion
    private posicion_2: Instruccion

    constructor(identificador: string, posicion_1:Instruccion, posicion_2:Instruccion, expresion: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.identificador = identificador
        this.expresion = expresion
        this.posicion_1 = posicion_1
        this.posicion_2 = posicion_2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let nuevo_valor = this.expresion.interpretar(arbol, tabla)
        if (nuevo_valor instanceof Errores) return nuevo_valor
        let valor = tabla.getMatriz(this.identificador.toLocaleLowerCase())
        if (valor == null){
            let error = new Errores("Semántico", "Variable No Existente", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Variable No Existente.\n")
            return error
        }
        if (this.expresion.tipoDato.getTipo() != valor.getTipo().getTipo()){
            let error = new Errores("Semántico", "Asignación Incorrecta", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Asignación Incorrecta.\n")
            return error 
        }
        let posicion1 = parseInt(this.posicion_1.interpretar(arbol, tabla))
        let posicion2 = parseInt(this.posicion_2.interpretar(arbol, tabla))
        this.tipoDato = valor.getTipo()
        valor.setValores(posicion1, posicion2, nuevo_valor)
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}