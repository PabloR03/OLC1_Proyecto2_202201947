
import Simbolo from "./Simbolo";
import Tipo, { tipoDato } from './Tipo'
import SimboloA from "./SimboloAr";
import SimboloM from "./SimboloMa";

export default class tablaSimbolo {
    private tablaAnterior: tablaSimbolo | any
    private tablaActual: Map<string, SimboloM|SimboloA|Simbolo>
    private nombre: string

    constructor(anterior?: tablaSimbolo) {
        this.tablaAnterior = anterior
        this.tablaActual = new Map<string, SimboloM|SimboloA|Simbolo>()
        this.nombre = ""
    }

    public getMatriz(id: string) {
        for (let i: tablaSimbolo = this; i != null; i = i.getAnterior()) {
            let busqueda: SimboloM = <SimboloM>i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        return null
    }

    public setMatriz(simbolo: SimboloM) {
        let busqueda: SimboloM = <SimboloM>this.getTabla().get(simbolo.getIdentificador().toLocaleLowerCase())
        if (busqueda == null) {
            this.tablaActual.set(simbolo.getIdentificador().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }
    public getArreglo(id: string) {
        for (let i: tablaSimbolo = this; i != null; i = i.getAnterior()) {
            let busqueda: SimboloA = <SimboloA>i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        return null
    }

    public setArreglo(simbolo: SimboloA) {
        let busqueda: SimboloA = <SimboloA>this.getTabla().get(simbolo.getIdentificador().toLocaleLowerCase())
        if (busqueda == null) {
            this.tablaActual.set(simbolo.getIdentificador().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }
    public getAnterior(): tablaSimbolo {
        return this.tablaAnterior
    }

    public setAnterior(anterior: tablaSimbolo): void {
        this.tablaAnterior = anterior
    }

    public getTabla(): Map<String, SimboloM|SimboloA|Simbolo> {
        return this.tablaActual;
    }

    public setTabla(tabla: Map<string, SimboloM|SimboloA|Simbolo>) {
        this.tablaActual = tabla
    }

    public getVariable(id: string) {
        for (let i: tablaSimbolo = this; i != null; i = i.getAnterior()) {
            let busqueda: Simbolo = <Simbolo>i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        return null
    }

    public setVariable(simbolo: Simbolo) {
        let busqueda: Simbolo = <Simbolo>this.getTabla().get(simbolo.getId().toLocaleLowerCase())
        if (busqueda == null) {
            this.tablaActual.set(simbolo.getId().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }

    public getNombre(): string {
        return this.nombre
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre
    }
}
