import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class GadgetsService {

  constructor(public http: Http) { }

  obtenerGadgets(id) {

    let data = {
      id:id
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://smartmirror-api.azurewebsites.net/GetGadgetStatus';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
  actualizar(userId,lstInside) {

    let data = {userId:userId,lstInside:lstInside};
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://smartmirror-api.azurewebsites.net/EditGadgetStatus';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
}
