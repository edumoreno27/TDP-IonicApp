import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { GadgetsService } from '../../datos/gadgets/gadgets.service';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class GadgetsProvider {
    orders: any;
    constructor(public http: Http, public _gs: GadgetsService, public storage: Storage) { }

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
        return this._gs.actualizarOrder(userId, lstInside);

    }

    guardar_storage(orders) {
        let promesa = new Promise((resolve, reject) => {
            this.storage.set("orders", JSON.stringify(orders))
                .then(() => {
                    console.log('orders guardados');
                    console.log(orders);
                    this.orders = orders;
                    resolve();
                }, (error) => {
                    resolve();
                    console.log(error);
                })

        });
        return promesa;
    }

    cargar_storage() {

        let promesa = new Promise((resolve, reject) => {
            this.storage.get("orders")
                .then(objeto => {
                    console.log(objeto);
                    if (objeto) {
                        this.orders = JSON.parse(objeto);
                        console.log("INGRESO AL CARGAR");
                        console.log(this.orders);
                        resolve();
                    }
                    
                })

        });
        return promesa;
    }
}
