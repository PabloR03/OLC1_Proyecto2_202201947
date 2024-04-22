//import { Instruccion } from "../abstracto/Instruccion";
//import Errores from "../excepciones/Errores";
//import Arbol from "../simbolo/Arbol";
//import tablaSimbolo from "../simbolo/tablaSimbolos";
//import Tipo, { tipoDato } from "../simbolo/Tipo";
//import Declaracion from "./Declaracion";
//import Metodo from "./Metodo";
//
//export default class Run extends Instruccion {
//    private id: string
//    private parametros: Instruccion[]
//
//    constructor(id: string, linea: number, col: number, parametros: Instruccion[]) {
//        super(new Tipo(tipoDato.VOID), linea, col)
//        this.id = id
//        this.parametros = parametros
//    }
//
//    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
//        let busqueda = arbol.getFuncion(this.id)
//        if (busqueda == null) return new Errores("SEMANTICO", "Funcion no existente", this.linea, this.col)
//
//        if (busqueda instanceof Metodo) {
//            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
//            newTabla.setNombre("RUN")
//            console.log(busqueda.parametros, this.parametros)
//            //para ver si busqueda.parametros tiene parametros
//            if (busqueda.parametros.length != this.parametros.length) {
//                return new Errores("SEMANTICO", "Parametros invalidos", this.linea, this.col)
//            }
//            // declaramos los parametros
//            for (let i = 0; i < busqueda.parametros.length; i++) {
//                let declaracionParametro = new Declaracion(
//                    busqueda.parametros[i].tipo, this.linea, this.col,
//                    busqueda.parametros[i].id, this.parametros[i])
//
//                // declarando parametro de metodo
//                let resultado:any = declaracionParametro.interpretar(arbol, newTabla)
//                if (resultado instanceof Errores) return resultado
//            }
//            
//
//            // una vez declarados los parametros, interpretamos la funcion
//            let resultadoFuncion: any = busqueda.interpretar(arbol, newTabla)
//            if (resultadoFuncion instanceof Errores) return resultadoFuncion
//
//        }
//    }
//}
