export default class Singleton {
    private static instancia: Singleton
    private contador: number

    private constructor() {
        this.contador = 0
    }

    public static getInstancia(): Singleton {
        if (!Singleton.instancia) {
            Singleton.instancia = new Singleton()
        }
        return Singleton.instancia
    }

    get() {
        this.contador++
        return this.contador
    }

}