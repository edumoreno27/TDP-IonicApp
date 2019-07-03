import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { WidgetService } from '../../data/widgets/widget.service';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class WidgetProvider {
    orders: any;
    constructor(public http: Http, public _ws: WidgetService, public storage: Storage) { }

    obtainWidgets(id) {

        return this._ws.obtainWidgets(id);

    }
    updateStateWidget(userId, lstInside) {
        return this._ws.updateStateWidget(userId, lstInside);
    }

    obtainOrderWidgets(id) {
        return this._ws.obtainOrderWidgets(id);

    }

    updateOrderWidget(userId, lstInside) {
        return this._ws.updateOrderWidget(userId, lstInside);

    }

    saveStorage(orders) {
        let promise = new Promise((resolve, reject) => {
            this.storage.set("orders", JSON.stringify(orders))
                .then(() => {                    
                    this.orders = orders;
                    resolve();
                }, (error) => {
                    resolve();
                    
                })

        });
        return promise;
    }

    loadStorage() {

        let promise = new Promise((resolve, reject) => {
            this.storage.get("orders")
                .then(result => {                    
                    if (result) {
                        this.orders = JSON.parse(result);                        
                        resolve();
                    }
                    
                })

        });
        return promise;
    }
}
