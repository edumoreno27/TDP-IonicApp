import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GadgetsService } from '../../datos/gadgets/gadgets.service';

@Injectable({
    providedIn: 'root'
})
export class GadgetsProvider {

    constructor(public http: Http, public _gs: GadgetsService) { }

    obtenerGadgets(id) {

        return this._gs.obtenerGadgets(id);

    }
    actualizar(userId, lstInside) {
        return this._gs.actualizarEstado(userId, lstInside);
    }

    obtenerOrderGadgets(id) {
        return this._gs.obtenerOrderGadgets(id);

    }

    actualizarOrder(userId, lstInside) {
        return this._gs.actualizarOrder(userId,lstInside);

    }
}
