//import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import TablaSimbolos from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";

export default class Case extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Instruccion[]
    public condicionCase?: Instruccion

    constructor(condicion: Instruccion, instrucciones: Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condi = this.condicion.interpretar(arbol, tabla)
        if( condi instanceof Errores) return condi
        let condiCase = this.condicionCase?.interpretar(arbol, tabla)
        if( condiCase instanceof Errores) return condiCase

        if(this.condicion.tipoDato.getTipo() != this.condicionCase?.tipoDato.getTipo()) return new Errores("Semantico", "Condicion es de tipo diferente", this.linea, this.col)

        if(condi == condiCase) {
            let tablas = new TablaSimbolos(tabla)
            tablas.setNombre("Sentencia Case")

            for(let i of this.instrucciones) {

                if(i instanceof Break) return i 
                if(i instanceof Continue) return i 

                let resultado = i.interpretar(arbol, tablas)
                if( resultado instanceof Errores) {
                    //lista_errores.push(resultado)
                    //arbol.actualizarConsola((<Errores>resultado).obtenerError())
                    console.log("errorsito")
                }

                if(resultado instanceof Break) return resultado
                if(resultado instanceof Continue) return resultado
                // AGREGAR ERRORES
            }
        }

    }

    public getCondicion() {

        if( this.condicion instanceof Errores) return this.condicion
        return this.condicion
    }
}