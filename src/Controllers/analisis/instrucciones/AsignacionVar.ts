import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionVar extends Instruccion {
    private id: string
    private exp: Instruccion

    constructor(id: string, exp: Instruccion, linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.id = id
        this.exp = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let NewValor = this.exp.interpretar(arbol, tabla)
        if (NewValor instanceof Errores) return NewValor

        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if (valor == null){
            let error = new Errores("Semántico", "Variable No Existente", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Variable No Existente.")
            return error
        }
        if (this.exp.tipoDato.getTipo() != valor.getTipo().getTipo()){
            let error = new Errores("Semántico", "Asignación Incorrecta", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Asignación Incorrecta.")
            return error 
        }
        this.tipoDato = valor.getTipo()
        valor.setValor(NewValor)
    }
    obtener_ast(anterior: string): string {
        let contador = Singleton.getInstancia();
        let dot = "";
        let raiz = `n${contador.getCount()}`;
        let id = `n${contador.getCount()}`;
        let valor_id = `n${contador.getCount()}`;
        let igual = `n${contador.getCount()}`;
        let asignacion = `n${contador.getCount()}`;
        dot += ` ${raiz}[label="ASIGNACION"];\n`;
        dot += `${id}[label="ID"];\n`;
        dot += `${valor_id}[label="${this.id}"];\n`;
        dot += `${igual}[label="="];\n`;
        dot += `${asignacion}[label="EXPRESION"];\n`;
        dot += ` ${anterior} -> ${raiz};\n`;
        dot += `${raiz} -> ${id};\n`;
        dot += `${id} -> ${valor_id};\n`;
        dot += `${raiz} -> ${igual};\n`;
        dot += `${raiz} -> ${asignacion};\n`;
        dot += this.exp.obtener_ast(asignacion);
        return dot;
    }
}