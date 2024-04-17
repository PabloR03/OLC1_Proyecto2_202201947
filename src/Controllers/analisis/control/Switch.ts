//import { lista_errores } from "../../controllers/index.controller";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import TablaSimbolos from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";
import Case from "./Case";
import Default from "./Default";

export default class Switch extends Instruccion {
    private condicion: Instruccion
    private casos: Case[] | undefined
    private default_: Instruccion | undefined

    constructor(condicion: Instruccion, linea: number, col: number, casos: Case[], defecto: Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.condicion = condicion
        this.casos = casos
        this.default_ = defecto
    }

    interpretar(arbol: Arbol, tabla: TablaSimbolos) {
        let condi = this.condicion.interpretar(arbol, tabla)

        if(condi instanceof Errores) return condi

        if(this.casos != undefined) {
            for(let caso of this.casos) {
                caso.condicionCase = this.condicion
                let resultado = caso.interpretar(arbol, tabla)

                    if( resultado instanceof Errores) {
                        //lista_errores.push(resultado)
                        //arbol.actualizarConsola((<Errores>resultado).obtenerError())
                    }

                    if(resultado instanceof Break) return

                    if(resultado instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.col)
            }
        }

        if(this.default_ != undefined) {
            let defecto = this.default_.interpretar(arbol, tabla)
            if(defecto instanceof Break) return
            if(defecto instanceof Continue) return new Errores("Semantico", "Continue no esta en un ciclo", this.linea, this.col)
            if( defecto instanceof Errores) return defecto
        }

    }
}