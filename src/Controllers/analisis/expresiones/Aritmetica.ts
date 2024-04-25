import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Singleton from "../simbolo/singleton";
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
            case Operadores.CASTEO:
                return this.casteo(valor_izquierda, valor_derecha)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.col)
        }
    }

    casteo(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //ENTERO CON TODOS LOS DEMÁS
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Casteo de Entero Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda)  
                    default:
                        return new Errores("Semántico", "Casteo de Double Inválida", this.linea, this.col)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CARACTER)
                        return valor_izquierda.charCodeAt(0)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CARACTER)
                        return parseFloat(valor_izquierda.charCodeAt(0))  
                    default:
                        return new Errores("Semántico", "Casteo de Double Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Potencia Inválida", this.linea, this.col)
        }
    }

    suma(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //ENTERO CON TODOS LOS DEMÁS
            case tipoDato.ENTERO:
                switch (tipo2) 
                {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) + parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_derecha === true) {
                            return parseInt(valor_izquierda) + 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda);
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) + valor_derecha.charCodeAt(0)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    default:
                        return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) 
                {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_derecha === true) {
                            return parseFloat(valor_izquierda) + 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda);
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) + parseFloat(valor_derecha.charCodeAt(0))
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    default:
                        return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
                }
            //BOOL CON TODOS LOS DEMÁS
            case tipoDato.BOOL:
                switch (tipo2) 
                {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_izquierda === true) {
                            return parseInt(valor_derecha) + 1;
                        } else if (valor_izquierda === false) {
                            return parseInt(valor_derecha);
                        }
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_izquierda === true) {
                            return parseFloat(valor_derecha) + 1;
                        } else if (valor_izquierda=== false) {
                            return parseFloat(valor_derecha);
                        }
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        if (valor_izquierda === true) {
                            return String("true" + valor_derecha)
                        } else if (valor_izquierda=== false) {
                            return String("false" + valor_derecha)
                        }
                    default:
                        return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
                }
            //CARACTER CON TODOS LOS DEMÁS
            case tipoDato.CARACTER:
                switch (tipo2) 
                {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda.charCodeAt(0)) + parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) + parseFloat(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    default:
                        return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
                }
            //CARACTER CON TODOS LOS DEMÁS
            case tipoDato.CADENA:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        if (valor_derecha === true) {
                            return String(valor_izquierda + "true")
                        } else if (valor_derecha === false) {
                            return String(valor_izquierda + "false")
                        }
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(valor_izquierda + valor_derecha)
                    default:
                        return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Suma Inválida", this.linea, this.col)
        }
    }

    resta(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                //ENTERO CON TODOS LOS DEMÁS
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) - parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) - parseFloat(valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_derecha === true) {
                            return parseInt(valor_izquierda) - 1
                        }
                        else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) 
                        }   
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) - parseInt(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Operación Resta Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) - parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) - parseFloat(valor_derecha)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_derecha === true) {
                            return parseFloat(valor_izquierda) - 1
                        }
                        else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) 
                        }  
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) - parseFloat(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Operación Resta Inválida", this.linea, this.col)
                }
            //BOOL CON TODOS LOS DEMÁS
            case tipoDato.BOOL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        if (valor_izquierda === true) {
                            return 1 - parseInt(valor_derecha)
                        }
                        else if (valor_izquierda === false) {
                            return 0 - parseInt(valor_derecha)
                        }  
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        if (valor_izquierda === true) {
                            return 1 - parseFloat(valor_derecha)
                        }
                        else if (valor_izquierda === false) {
                            return 0 - parseFloat(valor_derecha)
                        }  
                    default:
                        return new Errores("Semántico", "Operación Resta Inválida", this.linea, this.col)
                }
                //CARACTER CON TODOS LOS DEMÁS
                case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.ENTERO)
                            return parseInt(valor_izquierda.charCodeAt(0)) - parseInt(valor_derecha)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda.charCodeAt(0)) - parseFloat(valor_derecha)
                        default:
                            return new Errores("Semántico", "Operación Resta Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Resta Inválida", this.linea, this.col)
        }
    }

    multiplicacion(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //ENTERO CON TODOS LOS DEMÁS
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) * parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) * parseFloat(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda) * parseInt(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Operación Multiplicación Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) * parseFloat(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) * parseFloat(valor_derecha)
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda) * parseFloat(valor_derecha.charCodeAt(0))
                    default:
                        return new Errores("Semántico", "Operación Multiplicación Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.CARACTER:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(valor_izquierda.charCodeAt(0)) * parseInt(valor_derecha)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) * parseFloat(valor_derecha)
                    default:
                        return new Errores("Semántico", "Operación Multiplicación Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Multiplicación Inválida", this.linea, this.col)
        }
    }
    
    division(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        if (parseFloat(valor_derecha) === 0) {
            return new Errores("Semántico", "Operación División Invalida", this.linea, this.col)
        }
        else {
            switch (tipo1) {
                //ENTERO CON TODOS LOS DEMÁS
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
                            return parseFloat(valor_izquierda) / parseFloat(valor_derecha.charCodeAt(0))
                        default:
                            return new Errores("Semántico", "Operación División Invalida", this.linea, this.col)
                    }
                //DECIMAL CON TODOS LOS DEMÁS
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
                            return parseFloat(valor_izquierda) / parseFloat(valor_derecha.charCodeAt(0))
                        default:
                            return new Errores("Semántico", "Operación División Invalida", this.linea, this.col)
                    }
                //CARACTER CON TODOS LOS DEMÁS
                case tipoDato.CARACTER:
                    switch (tipo2) {
                        case tipoDato.ENTERO:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda.charCodeAt(0)) / parseFloat(valor_derecha)
                        case tipoDato.DECIMAL:
                            this.tipoDato = new Tipo(tipoDato.DECIMAL)
                            return parseFloat(valor_izquierda.charCodeAt(0)) / parseFloat(valor_derecha)
                        default:
                            return new Errores("Semántico", "Operación División Invalida", this.linea, this.col)
                    }
                default:
                    return new Errores("Semántico", "Operación División Invalida", this.linea, this.col)
            }
        }
    }

    modulo(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        if (parseFloat(valor_derecha) === 0) {
            return new Errores("Semántico", "Operación Modulo Inválida", this.linea, this.col)
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
                            return new Errores("Semántico", "Operación Modulo Inválida", this.linea, this.col)
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
                            return new Errores("Semántico", "Operación Modulo Inválida", this.linea, this.col)
                    }
                default:
                    return new Errores("Semántico", "Operación Modulo Inválida", this.linea, this.col)
            }
        }
    }

    potencia(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //ENTERO CON TODOS LOS DEMÁS
            case tipoDato.ENTERO:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return Math.pow(parseInt(valor_izquierda), parseInt(valor_derecha))
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    default:
                        return new Errores("Semántico", "Operación Potencia Inválida", this.linea, this.col)
                }
            //DECIMAL CON TODOS LOS DEMÁS
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return Math.pow(parseFloat(valor_izquierda), parseFloat(valor_derecha))
                    default:
                        return new Errores("Semántico", "Operación Potencia Inválida", this.linea, this.col)
                }
            default:
                return new Errores("Semántico", "Operación Potencia Inválida", this.linea, this.col)
        }
    }
    
    negacion(valor_izquierda: any) {
        let op_unico = this.operando_unico?.tipoDato.getTipo()
        switch (op_unico) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(valor_izquierda) * -1
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(valor_izquierda) * -1
            default:
                return new Errores("Semántico", "Operación Negación Unaria Inválida", this.linea, this.col)
        }
    }
    obtener_ast(anterior: string): string {
        let contador = Singleton.getInstancia();
        let dot = ""
        if (this.operacion == Operadores.NEGATIVO) {
            let nodo_negacion = `n${contador.getCount()}`
            let nodo_expresion = `n${contador.getCount()}`
            dot += `${nodo_negacion}[label=\"NEGACION\"];\n`
            dot += `${nodo_expresion}[label=\"EXPRESION\"];\n`
            dot += `${anterior}->${nodo_negacion};\n`
            dot += `${anterior}-> ${nodo_expresion};\n`
            dot += this.operando_unico?.obtener_ast(nodo_expresion)
        } else if (this.operacion == Operadores.SUMA) {
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_operacion = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            dot += `${nodo_expresion1}[label= \"EXPRESION\"];\n`
            dot += `${nodo_operacion}[label=\"+\"];\n`
            dot += `${nodo_expresion2}[label=\"EXPRESION\"];\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodo_operacion};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }else if(this.operacion == Operadores.RESTA){
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_operacion = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            dot += `${nodo_expresion1}[label= \"EXPRESION\"];\n`
            dot += `${nodo_operacion}[label=\"-\"];\n`
            dot += `${nodo_expresion2}[label=\"EXPRESION\"];\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodo_operacion};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }else if(this.operacion == Operadores.MULTIPLICACION){
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_operacion = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            dot += `${nodo_expresion1}[label= \"EXPRESION\"];\n`
            dot += `${nodo_operacion}[label=\"*\"];\n`
            dot += `${nodo_expresion2}[label=\"EXPRESION\"];\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodo_operacion};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }else if(this.operacion == Operadores.DIVISION){
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_operacion = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            dot += `${nodo_expresion1}[label= \"EXPRESION\"];\n`
            dot += `${nodo_operacion}[label=\"/\"];\n`
            dot += `${nodo_expresion2}[label=\"EXPRESION\"];\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodo_operacion};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }else if(this.operacion == Operadores.MODULO){
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_operacion = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            dot += `${nodo_expresion1}[label= \"EXPRESION\"];\n`
            dot += `${nodo_operacion}[label=\"%\"];\n`
            dot += `${nodo_expresion2}[label=\"EXPRESION\"];\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodo_operacion};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }else if(this.operacion == Operadores.POTENCIA){
            let nodo_expresion1 = `n${contador.getCount()}`
            let nodo_expresion2 = `n${contador.getCount()}`
            let par1 = `n${contador.getCount()}`
            let par2 = `n${contador.getCount()}`
            let nodoPow = `n${contador.getCount()}`
            let nodoComa = `n${contador.getCount()}`
            dot += `${nodoPow}[label="POTENCIA"];\n`
            dot += `${par1}[label="("];\n`
            dot += `${nodo_expresion1}[label="EXPRESION"];\n`
            dot += `${nodoComa}[label=","];\n`
            dot += `${nodo_expresion2}[label="EXPRESION"];\n`
            dot += `${par2}[label=")"];\n`
            dot += `${anterior} -> ${nodoPow};\n`
            dot += `${anterior} -> ${par1};\n`
            dot += `${anterior} -> ${nodo_expresion1};\n`
            dot += `${anterior} -> ${nodoComa};\n`
            dot += `${anterior} -> ${nodo_expresion2};\n`
            dot += `${anterior} -> ${par2};\n`
            dot += this.operando_izquierda?.obtener_ast(nodo_expresion1)
            dot += this.operando_derecha?.obtener_ast(nodo_expresion2)
        }
        return dot;
    }


}

export enum Operadores {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    MODULO,
    POTENCIA,
    CASTEO,
    NEGATIVO
}