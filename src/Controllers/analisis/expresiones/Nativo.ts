import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

// enteros y decimales
export default class Nativo extends Instruccion {
    valor: any

    constructor(tipo: Tipo, valor: any, fila: number, col: number) {
        super(tipo, fila, col)
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return this.valor
    }
    obtener_ast(anterior: string): string {
        let cc = Singleton.getInstancia()
        let nodoNativo = `n${cc.getCount()}`
        let nodoValor = `n${cc.getCount()}`
        let resultado = `${nodoNativo}[label=\"NATIVO\"];\n`
        resultado += `${nodoValor}[label=\"${this.valor}\"];\n`
        resultado += `${nodoNativo}->${nodoValor};\n`
        resultado += `${anterior}->${nodoNativo};\n`
        return resultado
    }
}