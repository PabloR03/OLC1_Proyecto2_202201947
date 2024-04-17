import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "../Transferencia.ts/Break";
import Continue from "../Transferencia.ts/Continue";

export default class For extends Instruccion {
    private declaracion: Instruccion
    private condicion: Instruccion
    private actualizacion: Instruccion
    private bloque: Instruccion[]

    constructor(declaracion: Instruccion, condicion: Instruccion, actualizacion: Instruccion, bloque:Instruccion[], linea: number, col: number) {
        super(new Tipo(tipoDato.VOID), linea, col)
        this.declaracion = declaracion
        this.condicion = condicion
        this.actualizacion = actualizacion
        this.bloque = bloque
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        const nueva_tabla1 = new tablaSimbolo(tabla)
        nueva_tabla1.setNombre("CondicionesFor")

        const  resultado_inicializacion = this.declaracion.interpretar(arbol, nueva_tabla1)
        if (resultado_inicializacion instanceof Errores) return resultado_inicializacion

        let condicion = this.condicion.interpretar(arbol, nueva_tabla1)
        if (condicion instanceof Errores) return condicion

        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            return new Errores("Semántico", "Condición Debe Ser Del Tipo Booleana", this.linea, this.col)
        }

        while (this.condicion.interpretar(arbol, nueva_tabla1)) {

            const nueva_tabla2 = new tablaSimbolo(nueva_tabla1)
            nueva_tabla2.setNombre("For")

            for (let ins of this.bloque) {
                if (ins instanceof Break) return;
                if (ins instanceof Continue) break;
            
                let resultado = ins.interpretar(arbol, nueva_tabla2)
            
                if (resultado instanceof Break) return;
                if (resultado instanceof Continue) break;
            }
            const  resultado_actualizacion = this.actualizacion.interpretar(arbol, nueva_tabla1)
            if (resultado_actualizacion instanceof Errores) return resultado_actualizacion
        }
        
    }
}