import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Singleton from "../simbolo/singleton";

export default class Print extends Instruccion {
    private expresion: Instruccion

    constructor(exp: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        if (valor instanceof Errores) return valor
        arbol.Print(valor)
    }
    obtener_ast(anterior: string): string {
        let dot = "";
        let contador = Singleton.getInstancia();
        let cout = `n${contador.getCount()}`;
        let menor_menor = `n${contador.getCount()}`;
        let expresion_node = `n${contador.getCount()}`;
        let punto_coma = `n${contador.getCount()}`;
        dot += `${cout}[label="cout"];\n`;
        dot += `${menor_menor}[label="<<"];\n`;
        dot += `${expresion_node}[label="EXPRESION"];\n`;
        dot += `${punto_coma}[label=";"];\n`;
        dot += `${anterior} -> ${cout};\n`;
        dot += `${anterior} -> ${menor_menor};\n`;
        dot += `${anterior} -> ${expresion_node};\n`;
        dot += `${anterior} -> ${punto_coma};\n`;
        dot += this.expresion.obtener_ast(expresion_node);
        return dot;
    }
} 