import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class OperadorRelacional extends Instruccion {
    private operando_izquierda: Instruccion | undefined
    private operando_derecha: Instruccion | undefined
    private operando_masderecha: Instruccion | undefined
    private operando_unico: Instruccion | undefined
    private operacion: OperadoresRelacionales

    constructor(operador: OperadoresRelacionales, linea: number, col: number, valor_izquierda: Instruccion, valor_derecha?: Instruccion, valor_masderecha?: Instruccion) {
        super(new Tipo(tipoDato.BOOL), linea, col)
        this.operacion = operador
        this.operando_izquierda = valor_izquierda
        this.operando_derecha = valor_derecha
        this.operando_masderecha = valor_masderecha
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor_izquierda, valor_derecha, valor_unico = null, valor_masderecha
        if (this.operando_unico != null) {
            valor_unico = this.operando_unico.interpretar(arbol, tabla)
            if (valor_unico instanceof Errores) return valor_unico
        } else {
            valor_izquierda = this.operando_izquierda?.interpretar(arbol, tabla)
            if (valor_izquierda instanceof Errores) return valor_izquierda
            valor_derecha = this.operando_derecha?.interpretar(arbol, tabla)
            if (valor_derecha instanceof Errores) return valor_derecha
            valor_masderecha = this.operando_masderecha?.interpretar(arbol, tabla)
            if (valor_masderecha instanceof Errores) return valor_masderecha
        }

        switch (this.operacion) {
            case OperadoresRelacionales.IGUALIGUAL:
                return this.igualigual(valor_izquierda, valor_derecha)
            case OperadoresRelacionales.DISTINTO:
                return this.diferenciacion(valor_izquierda, valor_derecha)
            case OperadoresRelacionales.MENORQUE:
                return this.menorque(valor_izquierda, valor_derecha)
            case OperadoresRelacionales.MENORIGUAL:
                return this.menorigual(valor_izquierda, valor_derecha)
            case OperadoresRelacionales.MAYORQUE:
                return this.mayorque(valor_izquierda, valor_derecha)
            case OperadoresRelacionales.MAYORIGUAL:
                return this.mayorigual(valor_izquierda, valor_derecha)
            //case OperadoresRelacionales.TERNARIO:
            //    return this.ternarios(valor_izquierda, valor_derecha)
            //case OperadoresRelacionales.OPERARTERNARIO:
            //    return this.operarternario(valor_izquierda, valor_derecha)
            default:
                return new Errores("Semantico", "Operador Relacional Invalido", this.linea, this.col)
        }
    }

    menorque(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) < parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) < parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) < 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) < 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) < parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) < parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) < parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) < 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) < 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) < parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 < parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 < parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return 1 < 1;
                        } else if (valor_derecha === false) {
                            return 0 < 0;
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 < parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) < parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) < parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) < 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) < 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) < parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return false
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

    menorigual(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) <= parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) <= parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) <= 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) <= 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) <= parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) <= parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) <= parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) <= 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) <= 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) <= parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 <= parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 <= parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return 1 <= 1;
                        } else if (valor_derecha === false) {
                            return 0 <= 0;
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 <= parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) <= parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) <= parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) <= 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) <= 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) <= parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        //para verificar que sean iguales usamos ===
                        return valor_izquierda.toString() === valor_derecha.toString()
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

    mayorque(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) > parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) > parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) > 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) > 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) > parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) > parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) > parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) > 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) > 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) > parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 > parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 > parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return 1 > 1;
                        } else if (valor_derecha === false) {
                            return 0 > 0;
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 > parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) > parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) > parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) > 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) > 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) > parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return false
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

    mayorigual(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) >= parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) >= parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) >= 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) >= 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) >= parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) >= parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) >= parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) >= 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) >= 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) >= parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 >= parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 >= parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return 1 >= 1;
                        } else if (valor_derecha === false) {
                            return 0 >= 0;
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 >= parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) >= parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) >= parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) >= 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) >= 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) >= parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        //para verificar que sean iguales usamos ===
                        return valor_izquierda.toString() === valor_derecha.toString()
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

    igualigual(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) === parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) === parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) === 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) === 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) === parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) === parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) === parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) === 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) === 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) === parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 === parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 === parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_izquierda === true) {
                            if (valor_derecha === true) {
                                return true
                            }
                            if (valor_derecha === false) {
                                return false
                            }
                        }
                        if (valor_izquierda === false) {
                            if (valor_derecha === true) {
                                return false
                            }
                            if (valor_derecha === false) {
                                return true
                            }
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 === parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) === parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) === parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) === 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) === 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) === parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return valor_izquierda.toString() === valor_derecha.toString()
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

    diferenciacion(valor_izquierda: any, valor_derecha: any) {
        let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
        let tipo2 = this.operando_derecha?.tipoDato.getTipo()
        switch (tipo1) {
            //enteros
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //entero-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) != parseInt(valor_derecha)
                    //entero-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) != parseFloat(valor_derecha)
                    //entero-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda) != 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda) != 0;
                        }
                    //entero-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda) != parseInt(valor_derecha.charCodeAt(0))
                    //entero-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Entero - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //decimal
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //double-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) != parseFloat(valor_derecha)
                    //double-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) != parseFloat(valor_derecha)
                    //double-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseFloat(valor_izquierda) != 1;
                        } else if (valor_derecha === false) {
                            return parseFloat(valor_izquierda) != 0;
                        }
                    //double-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda) != parseFloat(valor_derecha.charCodeAt(0))
                    //double-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Decimal - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                //boole
            case tipoDato.BOOL:
                switch (tipo2) {
                    //boole-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 != parseInt(valor_derecha)
                    //boole-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 != parseFloat(valor_derecha)
                    //boole-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_izquierda === true) {
                            if (valor_derecha === true) {
                                return false
                            }
                            if (valor_derecha === false) {
                                return true
                            }
                        }
                        if (valor_izquierda === false) {
                            if (valor_derecha === true) {
                                return true
                            }
                            if (valor_derecha === false) {
                                return false
                            }
                        }
                    //boole-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return 1 != parseFloat(valor_derecha.charCodeAt(0))
                    //boole-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Bool - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CARACTER:
                switch (tipo2) {
                    //caracter-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) != parseInt(valor_derecha)
                    //caracter-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseFloat(valor_izquierda.charCodeAt(0)) != parseFloat(valor_derecha)
                    //caracter-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            return parseInt(valor_izquierda.charCodeAt(0)) != 1;
                        } else if (valor_derecha === false) {
                            return parseInt(valor_izquierda.charCodeAt(0)) != 0;
                        }
                    //caracter-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return parseInt(valor_izquierda.charCodeAt(0)) != parseInt(valor_derecha.charCodeAt(0))
                    //caracter-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
                case tipoDato.CADENA:
                switch (tipo2) {
                    //cadena-entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-double
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL);
                        //console.log("entro antes del if")
                        if (valor_derecha === true) {
                            //console.log("entro")
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        } else if (valor_derecha === false) {
                            console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                            return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        }
                    //cadena-caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        console.log("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                        return new Errores("Semantico", "Comparacion Caracter - String invalida", this.linea, this.col)
                    //cadena-string
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        return valor_izquierda.toString() != valor_derecha.toString()
                    default:
                        return new Errores("Semantico", "Comparacion Invalida", this.linea, this.col)
                }
            default:
                return new Errores("Semantico", "OPERADOR MENOR QUE INVALIDO", this.linea, this.col)
        }
    }

   // ternarios(valor_izquierda: any, valor_derecha:any) {
   //     let tipo1 = this.operando_izquierda?.tipoDato.getTipo()
   //     let tipo2 = this.operando_derecha?.tipoDato.getTipo()
   //     
   //     if (valor_izquierda === true){
   //         //llamo a la funcion ternariosresultado para que me devuelva el valor de la derecha//

   //     }
   //     if (valor_izquierda === false){
   //         return valor_derecha
   //     }
   // }//

   // operarternario(valor_izquierda: any, valor_derecha: any) {
   //     if (valor_izquierda === true){
   //         return valor_izquierda
   //     }
   //     if (valor_izquierda === false){
   //         return valor_derecha
   //     }
//}
}

export enum OperadoresRelacionales {
    IGUALIGUAL,
    DISTINTO,
    MENORQUE,
    MENORIGUAL,
    MAYORQUE,
    TERNARIO,
    MAYORIGUAL,
    OPERARTERNARIO
}