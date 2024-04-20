import Tipo from './Tipo'

export default class Simbolo {
    private tipo: Tipo
    private id: string
    private valor: any
    private fila: number
    private columna: number

    constructor(tipo: Tipo, id: string, fila: number, columna: number, valor?: any) {
        this.tipo = tipo
        this.id = id.toLocaleLowerCase()
        this.valor = valor
        this.fila = fila
        this.columna = columna
    }

    public getTipo(): Tipo {
        return this.tipo
    }

    public setTipo(tipo: Tipo) {
        this.tipo = tipo
    }

    public getId() {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getValor() {
        return this.valor
    }

    public setValor(valor: any) {
        this.valor = valor
    }

    public getFila(): number {
        return this.fila
    }

    public getColumna(): number {
        return this.columna
    }
}