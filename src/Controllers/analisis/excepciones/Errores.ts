export default class Errores{
    private tipoErrpr: string;
    private descripcion: string;
    private fila: number;
    private columna: number;

    constructor(tipoError: string, descripcion: string, fila: number, columna: number){
        this.tipoErrpr = tipoError;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }

}