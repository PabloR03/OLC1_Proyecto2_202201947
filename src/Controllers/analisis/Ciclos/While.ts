import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Return from "../Transferencia.ts/Return";

export default class While extends Instruccion {
    private condicion: Instruccion
    private bloque: Instruccion[]

    constructor(condicion: Instruccion, bloque:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.bloque = bloque
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let condicion = this.condicion.interpretar(arbol, tabla)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            let error = new Errores("Semántico", "Condición Debe Ser Del Tipo Booleana", this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Condición Debe Ser Del Tipo Booleana.\n")
            return error
        }
        let nueva_tabla = new tablaSimbolo(tabla)
        nueva_tabla.setNombre("While")
        arbol.agregarTabla(nueva_tabla)

        while (this.condicion.interpretar(arbol, tabla)) {
            for (let ins of this.bloque) {
                if(ins instanceof Break) return ins
                if(ins instanceof Continue) return ins
                if(ins instanceof Return) return ins
                if(ins instanceof Errores) return ins

                let resultado = ins.interpretar(arbol, nueva_tabla)

                if(resultado instanceof Break) return resultado
                if(resultado instanceof Continue) return resultado
                if(resultado instanceof Return) return resultado
                if(resultado instanceof Errores) return resultado
            }
        }
    }
    obtener_ast(anterior: string): string {
        let dot = "";
        let contador = Singleton.getInstancia();
        let lista_instrucciones = [];
        let raiz = `n${contador.getCount()}`;
        let instruccion_while = `n${contador.getCount()}`;
        let parentesis_izquierdo = `n${contador.getCount()}`;
        let condicion = `n${contador.getCount()}`;
        let parentesis_derecho = `n${contador.getCount()}`;
        let llave_derecho = `n${contador.getCount()}`;
        let instrucciones_raiz = `n${contador.getCount()}`;
        for(let i = 0; i < this.bloque.length; i++){
            lista_instrucciones.push(`n${contador.getCount()}`);
        }
        let llave_izquierda = `n${contador.getCount()}`;
        dot += ` ${raiz}[label="CICLO WHILE"];\n`;
        dot += ` ${instruccion_while}[label="WHILE"];\n`;
        dot += ` ${parentesis_izquierdo}[label="("];\n`;
        dot += ` ${condicion}[label="EXPRESION"];\n`;
        dot += ` ${parentesis_derecho}[label=")"];\n`;
        dot += ` ${llave_derecho}[label="{"];\n`;
        dot += ` ${instrucciones_raiz}[label="INSTRUCCIONES"];\n`;
        for(let i = 0; i < this.bloque.length; i++){
            dot += ` ${lista_instrucciones[i]}[label="INSTRUCCION"];\n`;
        }
        dot += ` ${llave_izquierda}[label="}"];\n`;
        dot += ` ${anterior} -> ${raiz};\n`;
        dot += ` ${raiz} -> ${instruccion_while};\n`;
        dot += ` ${raiz} -> ${parentesis_izquierdo};\n`;
        dot += ` ${raiz} -> ${condicion};\n`;
        dot += ` ${raiz} -> ${parentesis_derecho};\n`;
        dot += ` ${raiz} -> ${llave_derecho};\n`;
        dot += ` ${raiz} -> ${instrucciones_raiz};\n`;
        for(let i = 0; i < this.bloque.length; i++){
            dot += ` ${instrucciones_raiz} -> ${lista_instrucciones[i]};\n`;
        }
        dot += ` ${raiz} -> ${llave_izquierda};\n`;
        for(let i = 0; i < this.bloque.length; i++){
            dot += this.bloque[i].obtener_ast(lista_instrucciones[i]);
        }
        dot += this.condicion.obtener_ast(condicion);
        return dot;
    }
}