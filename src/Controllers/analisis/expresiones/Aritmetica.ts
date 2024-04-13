import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class Aritmeticas extends Instruccion {
    private operando_izquierda: Instruccion | undefined
    private operando_derecha: Instruccion | undefined
    private operando_unico: Instruccion | undefined
    private operacion: Operadores

    constructor(operador: Operadores, linea: number, col: number, valor_izquierda: Instruccion, valor_derecha?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), linea, col)
        this.operacion = operador
        if (!valor_derecha) this.operando_unico = valor_izquierda
        else {
            this.operando_izquierda = valor_izquierda
            this.operando_derecha = valor_derecha
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_izquierda, valor_derecha, valor_unico = null
        if (this.operando_unico != null) {
            valor_unico = this.operando_unico.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } else {
            valor_izquierda = this.operando_izquierda?.interpretar(arbol, tabla)
            if (valor_izquierda instanceof Errores) return valor_izquierda
            valor_derecha = this.operando_derecha?.interpretar(arbol, tabla)
            if (valor_derecha instanceof Errores) return valor_derecha
        }

        switch (this.operacion) {
            case Operadores.SUMA:
                return this.suma(valor_izquierda, valor_derecha)
            case Operadores.RESTA:
                return this.resta(valor_izquierda, valor_derecha)
            case Operadores.DIVISION:
                return this.division(valor_izquierda, valor_derecha)
            case Operadores.POTENCIA:
                return this.potencia(valor_izquierda, valor_derecha)
            case Operadores.NEGATIVO:
                return this.negacion(valor_unico)
            case Operadores.MULTIPLICACION:
                return this.multiplicacion(valor_izquierda, valor_derecha)
            case Operadores.MODULO:
                return this.modulo(valor_izquierda, valor_derecha)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    suma(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) + parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_derecha.toLowerCase() === "true") {
                            return parseInt(valor_izquierda) + 1;
                        } else if (valor_derecha.toLowerCase() === "false") {
                            return parseInt(valor_izquierda);
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) + parseInt(valor_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return valor_izquierda + valor_derecha
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Suma Invalida", this.linea, this.col)
        }
    }

    multiplicacion(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //MULTIPLICACION CON ENTERO
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) * parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) * parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) * parseInt(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semantico", "Multiplicación Invalida", this.linea, this.col)
                }
            //MULTIPLICACION CON DECIMAL
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) * parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) * parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) * parseFloat(valor_derecha.charCodeAt(0))).toFixed(2)
                    default:
                        return new Errores("Semantico", "Multiplicación Invalida", this.linea, this.col)
                }
            //MULTIPLICACION CON CARACTER
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda.charCodeAt(0)) * parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda.charCodeAt(0)) * parseFloat(valor_derecha)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Multiplicación Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
        }

    }


    resta(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //RESTAS CON ENTERO
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) - parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) - parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_derecha.toLowerCase() === "true") {
                            return parseInt(valor_izquierda) - 1
                        }
                        else if (valor_derecha.toLowerCase() === "false") {
                            return parseInt(valor_izquierda) 
                        }   
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) - parseInt(valor_derecha)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            // RESTAS CON DECIMAL
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) - parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) - parseFloat(valor_derecha)).toFixed(2)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_derecha.toLowerCase() === "true") {
                            return (parseFloat(valor_izquierda) - 1).toFixed(2)
                        }
                        else if (valor_derecha.toLowerCase() === "false") {
                            return parseFloat(valor_izquierda) 
                        }  
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(valor_izquierda) - parseFloat(valor_derecha)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            // RESTAS CON BOOLEANO
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_izquierda.toLowerCase() === "true") {
                            return 1 - parseInt(valor_derecha)
                        }
                        else if (valor_izquierda.toLowerCase() === "false") {
                            return 0 - parseInt(valor_derecha)
                        }  
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_izquierda.toLowerCase() === "true") {
                            return (1 - parseFloat(valor_derecha)).toFixed(2)
                        }
                        else if (valor_izquierda.toLowerCase() === "false") {
                            return (0 - parseFloat(valor_derecha)).toFixed(2)
                        }  
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
                //RESTAS CON CARACTER
                case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.ENTERO)
                            return parseInt(valor_izquierda) - parseInt(valor_derecha)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return (parseFloat(valor_izquierda) - parseFloat(valor_derecha)).toFixed(2)
                        default:
                            return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.col)
        }

    }

    division(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        if (parseFloat(valor_derecha) === 0) {
            return "no se puede dividir entre 0"
        }
        else {
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    default:
                        return new Errores("Semantico", "Division Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                    default:
                        return new Errores("Semantico", "Division Invalida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
            switch (tipo2) {
                case tipoDato.ENTERO:
                    this.tipoDato = new Tipo(tipoDato.DECIMAL)
                    return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                case tipoDato.DECIMAL:
                    this.tipoDato = new Tipo(tipoDato.DECIMAL)
                    return parseFloat(valor_izquierda) / parseFloat(valor_derecha)
                default:
                    return new Errores("Semantico", "Division Invalida", this.linea, this.col)
            }
            default:
                return new Errores("Semantico", "Division Invalida", this.linea, this.col)
        }
    }
    }

    potencia(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return Math.pow(parseInt(valor_izquierda), parseInt(valor_derecha))
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    default:
                        return new Errores("Semantico", "Potencia Invalida", this.linea, this.col)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    default:
                        return new Errores("Semantico", "Potencia Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "Potencia Invalida", this.linea, this.col)
        }
    }
            
    modulo(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        if (parseFloat(valor_derecha) === 0) {
            return "no se puede dividir entre 0"
        }
        else {
            switch (tipo1) {
                case tipoDato.ENTERO:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda) % parseFloat(valor_derecha)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda) % parseFloat(valor_derecha)
                        default:
                            return new Errores("Semantico", "Division Invalida", this.linea, this.col)
                    }
                case tipoDato.DECIMAL:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda) % parseFloat(valor_derecha)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda) % parseFloat(valor_derecha)
                        default:
                            return new Errores("Semantico", "Division Invalida", this.linea, this.col)
                    }
                default:
                    return new Errores("Semantico", "Division Invalida", this.linea, this.col)
            }
        }
    }

    negacion(valor_izquierda: any) {
        let opU = this.operando_unico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor_izquierda) * -1
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(valor_izquierda) * -1
            default:
                return new Errores("Semantico", "Negacion Unaria invalida", this.linea, this.col)
        }
    }

}

export enum Operadores {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    MODULO,
    POTENCIA,
    NEGATIVO
}