import tipo from './Tipo';
export default class Simbolo{
    private tipo: tipo;
    private id: string;
    private valor: any;

    constructor(tipo: tipo, id: string, valor: any){
        this.tipo = tipo;
        this.id = id;
        this.valor = valor;
    }

    public getTipo(): tipo{
        return this.tipo;
    }
    public setTipo(tipo: tipo){
        this.tipo = tipo;
    }

    public getId(): string{
        return this.id;
    }
    public setId(id: string){
        this.id = id;
    }

    public getValor(): any{
        return this.valor;
    }
    public setValor(valor: any){
        this.valor = valor;
    }
}