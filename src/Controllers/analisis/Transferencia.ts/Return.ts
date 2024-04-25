import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export default class Return extends Instruccion{

    public expresion: Instruccion | undefined;

    constructor(linea:number, columna:number,expresion?: Instruccion){
        super(new Tipo(tipoDato.VOID), linea, columna);
        this.expresion = expresion;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if(this.expresion != undefined){
            let result = this.expresion.interpretar(arbol, tabla);
            if(result instanceof Errores) return result;
        }
        return this;
    }
    obtener_ast(anterior: string): string {
        let contador = Singleton.getInstancia()
        let dot = ""
        let retorno = `n${contador.getCount()}`
        let expresion = `n${contador.getCount()}`
        let punto_coma = `n${contador.getCount()}`
        dot += `${retorno}[label="RETURN"];\n`
        if(this.expresion != undefined){
            dot += `${expresion}[label="EXPRESION"];\n`
        }
        dot += `${punto_coma}[label=";"];\n`
        dot += `${anterior} -> ${retorno};\n`
        if(this.expresion != undefined){
            dot += `${anterior} -> ${expresion};\n`
        }
        dot += `${anterior} -> ${punto_coma};\n`
        if(this.expresion != undefined){
            dot += this.expresion.obtener_ast(expresion)
        }
        return dot
    }
}