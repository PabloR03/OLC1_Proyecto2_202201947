import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Arbol from "../simbolo/Arbol";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Metodo from "./metodo";
import Declaracion from "../instrucciones/Declaracion";
//import ContadorSingleton from "../simbolo/contadorSingleton";

export default class Llamada extends Instruccion {

    private id: string;
    private parametros: Instruccion[];

    constructor(id: string, parametros: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col);
        this.id = id;
        this.parametros = parametros;
    }
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let busqueda_funcion = arbol.getFuncion(this.id);
        if (busqueda_funcion == null) {
            let error = new Errores("Semántico", "No Existe La Función: "+ this.id, this.linea, this.col)
            arbol.agregarError(error);
            arbol.setConsola("Semántico: No Existe La Función: "+ this.id+".\n")
            return error 
        }
        this.tipoDato.setTipo(busqueda_funcion.tipo.getTipo());
        if (busqueda_funcion instanceof Metodo) {
            if (busqueda_funcion.tipo.getTipo() == tipoDato.VOID) {

                let nueva_tabla = new tablaSimbolo(tabla);
                nueva_tabla.setNombre(this.id)
                arbol.agregarTabla(nueva_tabla)
                
                if (busqueda_funcion.parametros.length != this.parametros.length) {
                    let error = new Errores("Semántico", "Cantidad De Parámetros Inválida: "+ this.id, this.linea, this.col)
                    arbol.agregarError(error)
                    arbol.setConsola("Semántico: Cantidad De Parámetros Inválida: "+ this.id+".\n")
                    return error 
                }
                for (let i = 0; i < busqueda_funcion.parametros.length; i++) {
                    let declaracion_parametro = new Declaracion(
                        busqueda_funcion.parametros[i].tipo, 
                        this.linea, 
                        this.col, 
                        busqueda_funcion.parametros[i].id, 
                        this.parametros[i]
                    );
                    let resultado:any = declaracion_parametro.interpretar(arbol, nueva_tabla);
                    if (resultado instanceof Errores) return resultado;
                }
                let resultado_funcion: any = busqueda_funcion.interpretar(arbol, nueva_tabla);
                if (resultado_funcion instanceof Errores) return resultado_funcion;
            } else {

                let nueva_tabla = new tablaSimbolo(tabla);
                nueva_tabla.setNombre(this.id);
                arbol.agregarTabla(nueva_tabla)

                if (busqueda_funcion.parametros.length != this.parametros.length) {
                    let error = new Errores("Semántico", "Cantidad De Parámetros Inválida: "+ this.id, this.linea, this.col)
                    arbol.agregarError(error)
                    arbol.setConsola("Semántico: Cantidad De Parámetros Inválida: "+ this.id+".\n")
                    return error 
                }
                for (let i = 0; i < busqueda_funcion.parametros.length; i++) {
                    let nueva_variable = this.parametros[i].interpretar(arbol, nueva_tabla);
                    let declaracion_parametro = new Declaracion(
                        busqueda_funcion.parametros[i].tipo, 
                        this.linea, this.col, 
                        busqueda_funcion.parametros[i].id, 
                        this.parametros[i]
                    );
                    let resultado:any = declaracion_parametro.interpretar(arbol, nueva_tabla);
                    if (resultado instanceof Errores) return resultado
                    let variable_interpretada = nueva_tabla.getVariable(busqueda_funcion.parametros[i].id[0])

                    if(variable_interpretada != null){
                        if(busqueda_funcion.parametros[i].tipo.getTipo() != variable_interpretada.getTipo().getTipo()){
                            let error = new Errores("Semántico", "Cantidad De Parámetros Inválida: "+ this.id, this.linea, this.col)
                            arbol.agregarError(error)
                            arbol.setConsola("Semántico: Cantidad De Parámetros Inválida: "+ this.id+".\n")
                            return error 
                        }else{
                            variable_interpretada.setValor(nueva_variable);  
                        }
                    }else{
                        let error = new Errores("Semántico", "Cantidad De Parámetros Inválida: "+ this.id, this.linea, this.col)
                        arbol.agregarError(error)
                        arbol.setConsola("Semántico: Cantidad De Parámetros Inválida: "+ this.id+".\n")
                        return error 
                    }
                }
                let resultado_funcion: any = busqueda_funcion.interpretar(arbol, nueva_tabla)
                if (resultado_funcion instanceof Errores) return resultado_funcion
                return busqueda_funcion.valor_retorno.interpretar(arbol, nueva_tabla)
            }
        }
    }
    obtener_ast(anterior: string): string {
        return ""
    }
}