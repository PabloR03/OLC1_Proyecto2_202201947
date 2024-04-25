import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Break extends Instruccion {
    constructor(linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }
    obtener_ast(anterior: string): string {
        let contador = Singleton.getInstancia()
        let dot = ""
        let instruccion_break = `n${contador.getCount()}`
        let punto_coma = `n${contador.getCount()}`
        dot += `${instruccion_break}[label="BREAK"];\n`
        dot += `${punto_coma}[label=";"];\n`
        dot += `${anterior} -> ${instruccion_break};\n`
        dot += `${anterior} -> ${punto_coma};\n`
        return dot
    }
}