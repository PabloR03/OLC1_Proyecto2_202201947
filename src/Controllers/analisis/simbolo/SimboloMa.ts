import Tipo from './Tipo'

export default class Matriz {
    private tipo_matriz: Tipo
    private identificador: string
    private valores: any[][]
    private fila: number
    private columna: number

    constructor(tipo_matriz: Tipo, fila: number, columna: number,identificador: string, valores: any[][]) {
        this.tipo_matriz = tipo_matriz
        this.identificador = identificador.toLocaleLowerCase()
        this.valores = valores
        this.fila = fila
        this.columna = columna
    }
    public getTipo(): Tipo {
        return this.tipo_matriz
    }

    public setTipo(tipo_matriz: Tipo) {
        this.tipo_matriz = tipo_matriz
    }

    public getIdentificador() {
        return this.identificador
    }

    public setIdentificador(identificador: string) {
        this.identificador = identificador
    }

    public getValores(posicion_1: number,posicion_2:number) {
        return this.valores[posicion_1][posicion_2].valor
    }

    public getValor() {
        return this.valores.map(fila => fila.map(nativo => nativo.valor));
    }
    
    public setValores(posicion_1:number,posicion_2:number,valores:any) {
        this.valores[posicion_1][posicion_2].valor = valores
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