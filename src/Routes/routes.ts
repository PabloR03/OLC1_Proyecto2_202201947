import { Router } from "express";
import { indexController } from "../Controllers/indexController";


class router {
    public router: Router = Router();;
    constructor() {
        this.config();
    }


    config(): void {
        this.router.get('/', indexController.prueba);
        this.router.post('/interpretar', indexController.interpretar)
        this.router.post('/rerrores', indexController.rerrores)
        this.router.post('/tablasimbolos', indexController.rtablasimbolos)
        this.router.post('/arbolast', indexController.rarbolast)
        // this.router.post('/reporte', indexController.reporteErrores)
    }
}


const indexRouter=new router();
export default indexRouter.router;