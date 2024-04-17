import tablaSimbolo from "./tablaSimbolos";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import fs from 'fs';

export default class Arbol {
    private instrucciones: Array<Instruccion>
    private consola: string
    private tablaGlobal: tablaSimbolo
    private errores: Array<Errores>

    constructor(instrucciones: Array<Instruccion>) {
        this.instrucciones = instrucciones
        this.consola = ""
        this.tablaGlobal = new tablaSimbolo()
        this.errores = new Array<Errores>
    }

    public Print(contenido: any) {
        this.consola = `${this.consola}${contenido}`;
    }

    public Printl(contenido: any) {
        this.consola = `${this.consola}${contenido}\n`;
    }

    public getConsola(): string {
        return this.consola
    }

    public setConsola(console: string): void {
        this.consola = console
    }

    public getInstrucciones(): Array<Instruccion> {
        return this.instrucciones
    }

    public setInstrucciones(instrucciones: Array<Instruccion>): void {
        this.instrucciones = instrucciones
    }

    public getTablaGlobal(): tablaSimbolo {
        return this.tablaGlobal
    }

    public setTablaGlobal(tabla: tablaSimbolo) {
        this.tablaGlobal = tabla
    }

    public getErrores(): any {
        return this.errores
    }

    
    public agregarError(error: Errores): void {
        this.errores.push(error);
    }
    
    public generarReporteErrores(): void {
        let html = 
        `<html>
        <head>
            <title>Reporte de Errores</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    text-align: center;
                }
                table {
                    margin: 0 auto;
                    border: 1px solid black;
                    border-collapse: collapse;
                    width: 80%;
                    background-color: white;
                }
                th, td {
                    border: 1px solid black;
                    padding: 10px;
                }
            </style>
        </head>
        <body>
            <h1>Reporte de Errores</h1>
            <table>
                <tr>
                    <th>Tipo de Error</th>
                    <th>Descripción</th>
                    <th>Fila</th>
                    <th>Columna</th>
                </tr>`;
                for (let error of this.errores) {
                    html += `
                    <tr>
                        <td>${error.getTipoError()}</td>
                        <td>${error.getDescripcion()}</td>
                        <td>${error.getFila()}</td>
                        <td>${error.getColumna()}</td>
                    </tr>`;
                }
                html += `
            </table>
        </body>
        </html>`;
        fs.writeFileSync('reporteErrores.html', html);
    }
}