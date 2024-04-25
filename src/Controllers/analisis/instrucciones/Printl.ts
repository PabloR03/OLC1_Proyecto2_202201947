import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Singleton from "../simbolo/singleton";

export default class Printl extends Instruccion {
    private expresion: Instruccion

    constructor(exp: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        if (valor instanceof Errores) return valor
        arbol.Printl(valor)
    }

    obtener_ast(anterior: string): string {
        let dot = "";
        let contador = Singleton.getInstancia();
        let cout = `n${contador.getCount()}`;
        let menor_menor1 = `n${contador.getCount()}`;
        let expresion_node = `n${contador.getCount()}`;
        let menor_menor2 = `n${contador.getCount()}`;
        let endl = `n${contador.getCount()}`;
        let punto_coma = `n${contador.getCount()}`;
        dot += `${cout}[label="cout" color = \"#026994\"];\n`;
        dot += `${menor_menor1}[label="<<" color = \"#026994\"];\n`;
        dot += `${expresion_node}[label="EXPRESION" color = \"#026994\"];\n`;
        dot += `${menor_menor2}[label="<<" color = \"#026994\"];\n`;
        dot += `${endl}[label="endl" color = \"#026994\"];\n`;
        dot += `${punto_coma}[label=";" color = \"#026994\"];\n`;
        dot += `${anterior} -> ${cout};\n`;
        dot += `${anterior} -> ${menor_menor1};\n`;
        dot += `${anterior} -> ${expresion_node};\n`;
        dot += `${anterior} -> ${menor_menor2};\n`;
        dot += `${anterior} -> ${endl};\n`;
        dot += `${anterior} -> ${punto_coma};\n`;
        dot += this.expresion.obtener_ast(expresion_node);
        return dot;
    }
} 