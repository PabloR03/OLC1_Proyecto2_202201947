//import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import TablaSimbolos from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";

export default class Default extends Instruccion {
    private instrucciones: Instruccion[]
    private condi : any

    constructor(instrucciones: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {

        let tablas = new TablaSimbolos(tabla)
        tablas.setNombre("Sentencia Default")

        for(let i of this.instrucciones) {

            if(i instanceof Break) return i 
            if(i instanceof Continue) return i 

            let resultado = i.interpretar(arbol, tablas)
            if( resultado instanceof Errores) {
                //lista_errores.push(resultado)
                //arbol.actualizarConsola((<Errores>resultado).obtenerError())
                console.log("errorsito default")
            }

            if(resultado instanceof Break) return resultado
            if(resultado instanceof Continue) return resultado
            // AGREGAR ERRORES
        }
    }
}