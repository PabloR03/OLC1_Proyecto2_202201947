import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import Singleton from "../simbolo/singleton";
import TablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class Declaracion extends Instruccion {
    private identificador: string[]
    private valor: Instruccion

    constructor(tipo: Tipo, linea: number, col: number, id: string[], valor: Instruccion) {
        super(tipo, linea, col)
        this.identificador = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolo) {
        let valor_variable;
        this.identificador.forEach((elemento) => {
            if(this.valor === null){
                valor_variable = this.valor_defecto(this.tipoDato)
            }else{
                valor_variable = this.valor.interpretar(arbol, tabla)
                if (valor_variable instanceof Errores) return valor_variable
                if ((valor_variable  == true || valor_variable  == false) && this.tipoDato.getTipo() == tipoDato.ENTERO) {
                    valor_variable = valor_variable == true ? 1 : 0;
                }else if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()) {
                    let error = new Errores("Semántico", "Error Al Declarar Variable.", this.linea, this.col)
                    arbol.agregarError(error);
                    arbol.setConsola("Semántico: Error Al Declarar Variable Los Tipos no coinciden.\n")
                    return error
                }
            }
            if (this.tipoDato.getTipo() == tipoDato.ENTERO) {
                if (parseInt(valor_variable) < -2147483648 || parseInt(valor_variable) > 2147483647) {
                    let error = new Errores("Semántico", "Variable Int Fuera De Rango.", this.linea, this.col);
                    arbol.agregarError(error);
                    arbol.setConsola("Semántico: Variable Int Fuera De Rango.\n")
                    return error
                }
            }
            if (!tabla.setVariable(new Simbolo(this.tipoDato, elemento, this.linea, this.col, valor_variable))){
                let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                arbol.agregarError(error);
                arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                return error
            }
        });
    }

    private valor_defecto(tipo: Tipo): any {
        switch (tipo.getTipo()) {
            case tipoDato.ENTERO:
                return 0
            case tipoDato.DECIMAL:
                return 0
            case tipoDato.BOOL:
                return true
            case tipoDato.CARACTER:
                return ''
            case tipoDato.CADENA:
                return ""
            default:
                return null
        }
    }
    obtener_ast(anterior: string): string {
        let contador = Singleton.getInstancia();
        let dot = "";
        let declaracion = `n${contador.getCount()}`;
        let tipo_id = `n${contador.getCount()}`;
        let id = `n${contador.getCount()}`;
        let lista_id = [];
        for(let i= 0; i < this.identificador.length; i++){
            lista_id.push(`n${contador.getCount()}`);
        }
        let igual = `n${contador.getCount()}`;
        let valor = `n${contador.getCount()}`;
        let punto_coma = `n${contador.getCount()}`;
    
        dot += `${declaracion}[label="DECLARACION" color = \"#00cb95\"];\n`
        if(this.tipoDato.getTipo() == tipoDato.ENTERO){
            dot += `${tipo_id}[label="ENTERO" color = \"#00cb95\"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.DECIMAL){
            dot += `${tipo_id}[label="DOBLE" color = \"#00cb95\"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.BOOL){
            dot += `${tipo_id}[label="BOOLEANO" color = \"#00cb95\"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.CADENA){
            dot += `${tipo_id}[label="CADENA" color = \"#00cb95\"];\n`
        }else if(this.tipoDato.getTipo() == tipoDato.CARACTER){
            dot += `${tipo_id}[label="CARACTER" color = \"#00cb95\"];\n`
        }
        dot += `${id}[label="ID" color = \"#00cb95\"];\n`
        for(let i= 0; i < this.identificador.length; i++){
            dot += `${lista_id[i]} [label = "${this.identificador[i]}" color = \"#00cb95\"];\n`
        }
        dot += `${anterior} -> ${declaracion};\n`
        dot += `${declaracion} -> ${id};\n`
        dot += `${declaracion} -> ${tipo_id};\n`
        for(let i= 0; i < this.identificador.length; i++){
            dot += `${id} -> ${lista_id[i]};\n`
        }
        if (this.valor != null) {
            dot += `${igual}[label="=" color = \"#00cb95\"];\n`
            dot += `${valor}[label="EXPRESION" color = \"#00cb95\"];\n`
            dot += `${declaracion} -> ${igual};\n`
            dot += `${declaracion} -> ${valor};\n`
            dot += this.valor.obtener_ast(valor);
        }
        dot += `${punto_coma}[label=";" color = \"#00cb95\"];\n`
        dot += `${declaracion} -> ${punto_coma};\n`
        return dot;
    }

}