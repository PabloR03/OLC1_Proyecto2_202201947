//import { Instruccion } from "./Instruccion";
//import { Environment } from "../Symbol/Environment";
//import { Expresion } from "../Expresion/Expresion";

//import { Instruccion } from "../abstracto/Instruccion";
//import Errores from "../excepciones/Errores";
//import Arbol from "../simbolo/Arbol";
//import tablaSimbolo from "../simbolo/tablaSimbolos";
//import Tipo, { tipoDato } from "../simbolo/Tipo";
//
//export class CallVoid extends Instruccion{
//
//    constructor(private id:string, private tipo: Tipo, linea:number, col:number){
//        super(tipo,linea,col)
//    }
//
//    public interpretar(tabla: tablaSimbolo, consola: string[]) {
//        console.log("CALL VOID");
//        const funcion = tabla.getFunction(this.id);
//        if (funcion == null || funcion == undefined){
//            console.log("Funcion no existe");
//            //throw {error: "Semantico", `mensaje: La funcion ${this.id} no existe`, linea: this.linea, col: this.col};
//        }
//        const newEnv = new Environment(tabla.getGlobal());
//
//        if (this.expresiones != null){
//            for (let i = 0; i < this.expresiones.length; i++){
//                const value = this.expresiones[i].interpretar(environment_name);
//                newEnv.saveVar(funcion.parameters[i], value.valor, value.tipo, this.line, this.column);
//            }
//        }
//        funcion.statements.interpretar(newEnv, consola);
//    }
//}
//
//


//





/*
//import { Environment } from "../simbolo/Environment";
import tablaSimbolo from "../simbolo/tablaSimbolos";
//import { Expresion } from "./Expresion";
import { Instruccion } from "../abstracto/Instruccion";

//import { Resultado, TipoDato } from "./Resultado";
import Tipo, { tipoDato } from "../simbolo/Tipo";


export class CallReturn extends Instruccion{
    private id: string;
    private expresion: Instruccion[];
    private consola: string[];

    constructor(id: string, expresion: Instruccion[], linea: number, col: number){
        super(linea, col);
        this.id = id;
        this.expresion = expresion;
        this.consola = [];
    }

    public interpretar(environment_name: Environment): Resultado {
        const funcion = environment_name.getFunction(this.id);
        if (funcion == null || funcion == undefined){
            throw {error: "Semantico", mensaje: La funcion ${this.id} no existe, linea: this.line, col: this.column};
        }
        const newEnv = new Environment(environment_name.getGlobal());
        if (this.expresion != null){
            for (let i = 0; i < this.expresion.length; i++){
                const value = this.expresion[i].interpretar(environment_name);
                newEnv.saveVar(funcion.parameters[i], value.valor, value.tipo, this.line, this.column);
            }
        }
        let result = funcion.statements.interpretar(newEnv, this.consola);
        if (result != null && result != undefined){
            return result;
        }
        return {valor: null, tipo: TipoDato.NULO};
    }

    public setConsola(consola: string[]): void{
        this.consola = consola;
    }

}*/