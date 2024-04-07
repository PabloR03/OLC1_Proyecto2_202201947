import {Request, Response} from 'express'

class controller {
    public prueba(req: Request, res: Response) {
        res.json('Hello World')
    }
    public metodoPost(req: Request, res: Response) {
        console.log(req.body)
        console.log(req.body.notas)
        res.json({ message: 'Metodo Post' })
    }
    public Analizar(req: Request, res: Response) {
        try {
            let parser = require('./analizador.js')
            let resultado = parser.parse(req.body.texto)
            res.json({ message: resultado })
        } catch (e: any) {
            res.json({ message: "Error" })
            console.log(e)
        }
    }
}
export const indexController = new controller()