import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GadgetsService } from '../../datos/gadgets/gadgets.service';

@Injectable({
    providedIn: 'root'
})
export class GadgetsProvider {

    constructor(public http: Http, public _gs: GadgetsService) { }

    obtenerGadgets() {

        return this._gs.obtenerGadgets();

    }
    actualizar(vistas) {
        return this._gs.actualizar(vistas);
    }
}
