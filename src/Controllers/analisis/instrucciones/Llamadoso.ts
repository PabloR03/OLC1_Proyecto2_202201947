//import { AsyncKeyword } from "typescript";
//import { Instruccion } from "../abstracto/Instruccion";
//import Errores from "../excepciones/Errores";
//import Arbol from "../simbolo/Arbol";
//import tablaSimbolo from "../simbolo/tablaSimbolos";
//import Tipo, { tipoDato } from "../simbolo/Tipo";
//import Declaracion from "./Declaracion";
//import Metodo from "./Metodoso";
//
//export default class Llamada extends Instruccion {
//
//    private id: string
//    private parametros: Instruccion[]
//
//    constructor(id: string, parametros: Instruccion[], linea: number, col: number) {
//        super(new Tipo(tipoDato.VOID), linea, col)
//        this.id = id
//        this.parametros = parametros
//    }
//
//    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
//        console.log("---")
//        let busqueda = arbol.getFuncion(this.id)
//        //console.log(busqueda)
//        console.log("-----")
//        if (busqueda == null) {
//            return new Errores("SEMANTICO", "Funcion no existente", this.linea, this.col)
//        }
//        this.tipoDato.setTipo(busqueda.tipoDato.getTipo())
//        if (busqueda instanceof Metodo) {
//
//            if(busqueda.tipoDato.getTipo()==tipoDato.VOID){
//                let newTabla = new tablaSimbolo(tabla);
//                newTabla.setNombre("Metodo: "+this.id)
//            //validacion parametros
//            if (busqueda.parametros.length != this.parametros.length) {
//                return new Errores("SEMANTICO", "Parametros invalidos", this.linea, this.col)
//            }
//
//            // es igual al run en su mayoria :D
//            for (let i = 0; i < busqueda.parametros.length; i++) {
//                let declaracionParametro = new Declaracion(
//                    busqueda.parametros[i].tipo, this.linea, this.col,
//                    busqueda.parametros[i].id, this.parametros[i]
//                )
//
//                let resultado:any  = declaracionParametro.interpretar(arbol, newTabla)
//                console.log("resultado declaracion parametro: ", resultado)
//                if (resultado instanceof Errores) return resultado
//            }
//            // interpretar la funcion a llamar
//            let resultadoFuncion: any = busqueda.interpretar(arbol, newTabla)
//            if (resultadoFuncion instanceof Errores) return resultadoFuncion
//        }else{
//            console.log("entro a la llamada de la funcion")
//            let nuevaTabla = new tablaSimbolo(tabla);
//                nuevaTabla.setNombre("Llamada función " + this.id);
//                if (busqueda.parametros.length != this.parametros.length) {
//                    return new Errores('Semántico', 'La cantidad de parametros no coincide con la función ' + this.id, this.linea, this.col);
//                }
//
//                for (let i = 0; i < busqueda.parametros.length; i++) {
//                    let nuevaVar = this.parametros[i].interpretar(arbol, nuevaTabla);
//                    let daclaraParam = new Declaracion(busqueda.parametros[i].tipo, this.linea, this.col, busqueda.parametros[i].id, this.parametros[i]);
//
//                    let result: any = daclaraParam.interpretar(arbol, nuevaTabla);
//
//                    if (result instanceof Errores) return result;
//
//                    
//                    console.log("la nuevaVar es: "+nuevaVar);
//                    console.log(busqueda.parametros[i].id[0])
//                    let varInterpretada = nuevaTabla.getVariable(busqueda.parametros[i].id[0]);
//
//                    if(varInterpretada != null){
//                        if(busqueda.parametros[i].tipo.getTipo() != varInterpretada.getTipo().getTipo()){
//                            return new Errores('Semántico', 'El tipo de parametro no coincide con la función ' + this.id, this.linea, this.col);
//                        }else{
//                            varInterpretada.setValor(nuevaVar);  
//                            console.log("la var interpretada es:"+varInterpretada.getValor());
//                        }
//                    }else{
//                        return new Errores('Semántico', 'La variable ' + busqueda.parametros[i].id + ' no existe en la función ' + this.id, this.linea, this.col);
//                    }
//
//                }
//
//                let resultFunc: any = busqueda.interpretar(arbol, nuevaTabla);
//                if (resultFunc instanceof Errores) return resultFunc;
//                //this.tipoDato.setTipo(busqueda.valorRetorno.tipoDato.getTipo());
//                //console.log("el valor de retorno es:",busqueda.valorRetorno.tipoDato.getTipo());
//                //this.tipoDato.setTipo(busqueda.valorRetorno.tipoDato.getTipo());
//                return busqueda.interpretar(arbol, nuevaTabla);
//            
//
//
//
//        }
//        }
//    }
//    getAST(anterior: string): string {
//        let resultado=""
//        return resultado
//    }
//}