import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
//import ContadorSingleton from "../simbolo/contadorSingleton";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Return from "../Transferencia.ts/Return";

export default class Metodo extends Instruccion {

    public id: string;
    public parametros: any = [];
    public instrucciones: Instruccion[];
    public tipo: Tipo;
    public valor_retorno: any = Instruccion;

    constructor(id: string, tipo: Tipo, parametros: any[], instrucciones: Instruccion[], linea: number, col: number) {
        super(tipo, linea, col)
        this.id = id
        this.parametros = parametros
        this.tipo = tipo
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if (this.tipo.getTipo() == tipoDato.VOID) {
            for (let i of this.instrucciones) {
                let resultado_interpretacion = i.interpretar(arbol, tabla)
                if (resultado_interpretacion instanceof Errores) return resultado_interpretacion
                if (resultado_interpretacion instanceof Return) {
                    if (resultado_interpretacion.expresion != undefined) return resultado_interpretacion
                    return
                }
            }
        }else{
            let retorno_existente = false;
            for(let i of this.instrucciones){
                if(i instanceof Return){
                    retorno_existente = true
                    if(i.expresion != undefined){
                        this.valor_retorno = i.expresion
                        return i.expresion
                    }else{
                        let error = new Errores("Semántico", "Se Debe El Return Debe Retornar Un Valor", this.linea, this.col)
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: Se Debe El Return Debe Retornar Un Valor.\n")
                        return error 
                    }
                }
                let resultado_interpretacion = i.interpretar(arbol, tabla);
                if(resultado_interpretacion instanceof Errores){
                    return resultado_interpretacion;
                }
                if(resultado_interpretacion instanceof Return){
                    if(resultado_interpretacion.expresion != undefined){
                        retorno_existente = true
                        this.valor_retorno = resultado_interpretacion.expresion
                        return resultado_interpretacion.expresion
                    }else{
                        let error = new Errores("Semántico", "Se Debe El Return Debe Retornar Un Valor", this.linea, this.col)
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: Se Debe El Return Debe Retornar Un Valor.\n")
                        return error 
                    }
                }
            }
            if(retorno_existente == false){
                let error = new Errores("Semántico", "No Existe Un Retorno En La Función", this.linea, this.col)
                arbol.agregarError(error);
                arbol.setConsola("Semántico: No Existe Un Retorno En La Función.\n")
                return error
            }
        }
    }
    obtener_ast(anterior: string): string {
        let dot = "";
        let contador = Singleton.getInstancia();
        let lista_tipo_parametro = [];
        let lista_parametros = [];
        let lista_instrucciones = [];
        let raiz = `n${contador.getCount()}`;
        let tipo_funcion = `n${contador.getCount()}`;
        let raiz_identificador = `n${contador.getCount()}`;
        let identificador = `n${contador.getCount()}`;
        let parentesis_izquierdo = `n${contador.getCount()}`;
        let parametros = `n${contador.getCount()}`;
        for(let i = 0; i < this.parametros.length; i++){
            lista_tipo_parametro.push(`n${contador.getCount()}`);
            lista_parametros.push(`n${contador.getCount()}`);
        }
        let parentesis_derecho = `n${contador.getCount()}`;
        let llave_izquierda = `n${contador.getCount()}`;
        let raiz_instrucciones = `n${contador.getCount()}`;
        for(let i= 0; i< this.instrucciones.length; i++){
            lista_instrucciones.push(`n${contador.getCount()}`);
        }
        let llave_derecha = `n${contador.getCount()}`;
        dot += `${raiz}[label="METODOS" color = \"#9ac1bc\" \n];\n`
        if(this.tipo.getTipo() == tipoDato.VOID){
            dot += `${tipo_funcion}[label="VOID" color = \"#9ac1bc\"];\n`
        }else if(this.tipo.getTipo() == tipoDato.ENTERO){
            dot += `${tipo_funcion}[label="INT" color = \"#9ac1bc\"];\n`
        }else if(this.tipo.getTipo() == tipoDato.DECIMAL){
            dot += `${tipo_funcion}[label="DOUBLE" color = \"#9ac1bc\"];\n`
        }else if(this.tipo.getTipo() == tipoDato.CADENA){
            dot += `${tipo_funcion}[label="STRING" color = \"#9ac1bc\"];\n`
        }else if(this.tipo.getTipo() == tipoDato.BOOL){
            dot += `${tipo_funcion}[label="BOOLE" color = \"#9ac1bc\"];\n`
        }
        dot += `${raiz_identificador}[label="ID" color = \"#9ac1bc\"];\n`
        dot += `${identificador}[label="${this.id}"];\n`
        dot += `${parentesis_izquierdo}[label="(" color = \"#9ac1bc\"];\n`
        dot += `${parametros}[label="PARAMETROS" color = \"#9ac1bc\"];\n`
        for(let i = 0; i < this.parametros.length; i++){
            if(this.parametros[i].tipo.getTipo() == tipoDato.ENTERO){
                dot += `${lista_tipo_parametro[i]}[label="INT" color = \"#9ac1bc\"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.DECIMAL){
                dot += `${lista_tipo_parametro[i]}[label="DOUBLE" color = \"#9ac1bc\"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CADENA){
                dot += `${lista_tipo_parametro[i]}[label="STRING" color = \"#9ac1bc\"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.BOOL){
                dot += `${lista_tipo_parametro[i]}[label="BOOLE" color = \"#9ac1bc\"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.VOID){
                dot += `${lista_tipo_parametro[i]}[label="VOID" color = \"#9ac1bc\"];\n`
            }else if(this.parametros[i].tipo.getTipo() == tipoDato.CARACTER){
                dot += `${lista_tipo_parametro[i]}[label="CHAR" color = \"#9ac1bc\"];\n`
            }
            
            dot += `${lista_parametros[i]}[label="${this.parametros[i].id}" color = \"#9ac1bc\"];\n`
        }
        dot += `${parentesis_derecho}[label=")" color = \"#9ac1bc\"];\n`
        dot += `${llave_izquierda}[label="{" color = \"#9ac1bc\"];\n`
        dot += `${raiz_instrucciones}[label="INSTRUCCIONES" color = \"#9ac1bc\"];\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            dot += `${lista_instrucciones[i]}[label="INSTRUCCION" color = \"#9ac1bc\"];\n`
        }
        dot += `${llave_derecha}[label="}" color = \"#9ac1bc\"];\n`
        dot += `${raiz} -> ${tipo_funcion};\n`
        dot += `${raiz} -> ${raiz_identificador};\n`
        dot += `${raiz_identificador} -> ${identificador};\n`
        dot += `${raiz} -> ${parentesis_izquierdo};\n`
        dot += `${raiz} -> ${parametros};\n`
        for(let i = 0; i < this.parametros.length; i++){
            dot += `${parametros} -> ${lista_tipo_parametro[i]};\n`
            dot += `${parametros} -> ${lista_parametros[i]};\n`
        }
        dot += `${raiz} -> ${parentesis_derecho};\n`
        dot += `${raiz} -> ${llave_izquierda};\n`
        dot += `${raiz} -> ${raiz_instrucciones};\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            dot += `${raiz_instrucciones} -> ${lista_instrucciones[i]};\n`
        }
        dot += `${raiz} -> ${llave_derecha};\n`
        dot += `${anterior} -> ${raiz};\n`
        for(let i = 0; i < this.instrucciones.length; i++){
            dot += this.instrucciones[i].obtener_ast(lista_instrucciones[i])
        }
        return dot
    }
}