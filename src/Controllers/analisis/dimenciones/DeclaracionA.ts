import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Arreglo from '../simbolo/SimboloAr';
import Nativo from "../expresiones/Nativo";

export default class DeclaracionArreglo extends Instruccion {
    private identificador: string
    private valor: Instruccion[]
    private tamano: Instruccion | undefined

    constructor(tipo: Tipo, linea: number, col: number, identificador: string , valor: Instruccion[], tamano?: Instruccion) {
        super(tipo, linea, col)
        this.identificador = identificador
        this.valor = valor
        this.tamano=tamano
    }
    
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if (this.valor == null && this.tamano!= undefined) {
            let tamano1Num = parseInt(this.tamano.interpretar(arbol, tabla))
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    let arreglo: Nativo[] = new Array<Nativo>(tamano1Num);
                    for (let i = 0; i < arreglo.length; i++) {
                        arreglo[i] = new Nativo(this.tipoDato, "0", 0, 0);
                    }
                    if (!tabla.setArreglo(new Arreglo(this.tipoDato,this.linea,this.col,this.identificador, arreglo))){
                        let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                        return error
                    }
                    break
                case tipoDato.DECIMAL:
                    let arreglo2: Nativo[] = new Array<Nativo>(tamano1Num);
                    for (let i = 0; i < arreglo2.length; i++) {
                        arreglo2[i] = new Nativo(this.tipoDato, "0.0", 0, 0);
                    }
                    if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, arreglo2))){
                        let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                        return error
                    }
                    break
                case tipoDato.BOOL:
                    let arreglo3: Nativo[] = new Array<Nativo>(tamano1Num);
                    for (let i = 0; i < arreglo3.length; i++) {
                        arreglo3[i] = new Nativo(this.tipoDato, true, 0, 0);
                    }
                    if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, arreglo3))){
                        let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                        return error
                    }
                    break
                case tipoDato.CADENA:
                    let arreglo4: Nativo[] = new Array<Nativo>(tamano1Num);
                    for (let i = 0; i < arreglo4.length; i++) {
                        arreglo4[i] = new Nativo(this.tipoDato, "", 0, 0);
                    }
                    if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, arreglo4))){
                        let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                        return error
                    }
                    break
                case tipoDato.CARACTER:
                    let arreglo5: Nativo[] = new Array<Nativo>(tamano1Num);
                    for (let i = 0; i < arreglo5.length; i++) {
                        arreglo5[i] = new Nativo(this.tipoDato, '', 0, 0);
                    }
                    if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, arreglo5))){
                        let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                        arbol.agregarError(error);
                        arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                        return error
                    }
                    break
                default:
                    let error = new Errores("Semántico", "La Variable Ya Existe.", this.linea, this.col);
                    arbol.agregarError(error);
                    arbol.setConsola("Semántico: La Variable Ya Existe.\n")
                    return error
            }  
        } else if (!tabla.setArreglo(new Arreglo(this.tipoDato, this.linea, this.col, this.identificador, this.valor))){
            let error = new Errores("Semántico", "Error Al Declarar Arreglo.", this.linea, this.col);
            arbol.agregarError(error);
            arbol.setConsola("Semántico: Error Al Declarar Arreglo.\n")
            return error
        }
    }
}