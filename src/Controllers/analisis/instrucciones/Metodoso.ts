//import { Instruccion } from "../abstracto/Instruccion";
//import Errores from "../excepciones/Errores";
//import Arbol from "../simbolo/Arbol";
//import tablaSimbolo from "../simbolo/tablaSimbolos";
//import Tipo, { tipoDato } from '../simbolo/Tipo'
//import Return from "../Transferencia.ts/retunrturn";
//
//
//export default class Metodo extends Instruccion {
//    public id: string
//    public parametros: any[]
//    public instrucciones: Instruccion[]
//    public tipoDato: Tipo
//    public valorBreak: any=Instruccion;
//
//    constructor( tipo: Tipo,id: string, parametros: any[], instrucciones: Instruccion[], linea: number, col: number) {
//        super(tipo, linea, col)
//        this.id = id
//        this.parametros = parametros
//        this.instrucciones = instrucciones
//        this.tipoDato = tipo
//    }
//
//    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
//        console.log('METODO')
//        if(this.tipoDato.getTipo() == tipoDato.VOID){
//            for(let i of this.instrucciones){
//                let resultado = i.interpretar(arbol,tabla)
//                if(resultado instanceof Return){
//                    return resultado
//                }
//                if(resultado instanceof Return){
//                    if(resultado.expresion != null){
//                        return resultado
//                    }
//                    return;
//                }
//            }
//        } else{
//
//            let banderaReturn = false
//            for(let x of this.instrucciones){
//                let i=x.interpretar(arbol,tabla)
//                console.log("<1>")
//                console.log(x)
//                console.log("<1>")
//                console.log(i)
//                if(i instanceof Errores){
//                    console.log("Si es error")
//                    return  i
//                }
//                if(i instanceof Return){
//                    banderaReturn = true
//                    console.log("444")
//                    if(i.expresion != undefined){
//                        this.valorBreak = i.expresion
//                        console.log("<2>")
//                        console.log(this.tipoDato.getTipo())    
//                        console.log(this.tipoDato.getTipo())
//                        console.log(i.tipoDato.getTipo())
//                        console.log("<2>")
//
//                            if(this.tipoDato.getTipo() != i.tipoDato.getTipo()){
//                                return new Errores('Semantico', 'El tipo de dato de la funcion ${this.id} no coincide con el tipo de dato de la expresion', this.linea, this.col)
//                            }
//                        console.log("<3>")
//                        console.log(i.expresion.interpretar(arbol,tabla))
//                        return i.expresion.interpretar(arbol,tabla)
//                    }else{
//                        return new Errores('Semantico', 'El tipo de dato de la funcion ${this.id} no coincide con el tipo de dato de la expresion', this.linea, this.col)
//                    }
//                }
//                //let resultado = x.interpretar(arbol,tabla)
//                let resultado = i   
//                if(resultado instanceof Errores){
//                    return resultado;
//                }
//                if(resultado instanceof Return){
//                    if(resultado.expresion != undefined){
//                        banderaReturn = true;
//                        this.valorBreak = resultado.expresion
//                        return resultado.expresion
//                    }else{
//                        return new Errores('Semantico', 'El tipo de dato de la funcion ${this.id} no coincide con el tipo de dato de la expresion', this.linea, this.col)
//                    }
//
//                }
//            }
//            if(banderaReturn==false){
//                return new Errores('Semantico', 'La funcion ${this.id} no tiene un return', this.linea, this.col)
//            }
//        }
//    }
//    getAST(anterior: string): string {
//        let resultado="Metodo"
//        return resultado
//    }
//}