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
}
export const indexController = new controller()