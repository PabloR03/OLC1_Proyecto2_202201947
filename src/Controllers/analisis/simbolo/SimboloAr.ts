import Tipo from './Tipo'

export default class Arreglo {
    private tipo_arreglo: Tipo
    private identificador: string
    private valores: any[]
    private fila: number
    private columna: number

    constructor(tipo_arreglo: Tipo, fila: number, columna: number, identificador: string, valores: any[]) {
        this.tipo_arreglo = tipo_arreglo
        this.identificador = identificador.toLocaleLowerCase()
        this.valores = valores
        this.fila = fila
        this.columna = columna
    }
    public getTipo(): Tipo {
        return this.tipo_arreglo
    }

    public setTipo(tipo_arreglo: Tipo) {
        this.tipo_arreglo = tipo_arreglo
    }

    public getIdentificador() {
        return this.identificador
    }

    public setIdentificador(identificador: string) {
        this.identificador = identificador
    }

    public getValores(posicion_1: number) {
        return this.valores[posicion_1].valor
    }

    public getValor() {
        return this.valores.map(nativo => nativo.valor)
    }    

    public setValores(posicion_1:number, valores:any) {
        this.valores[posicion_1].valor = valores
    }
    

    public getSize() {
        return this.valores.length
    }
    public getFila(): number {
        return this.fila
    }

    public getColumna(): number {
        return this.columna
    }
}