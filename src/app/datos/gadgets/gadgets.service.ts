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
    // let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ObtenerLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }

  obtenerOrderGadgets(id) {

    let data = {
      id:id
    };
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    
    let url = proxyurl+'http://smartmirror-api.azurewebsites.net/GetGadgetOrder';
    // let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ObtenerLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
  
  actualizarEstado(userId,lstInside) {

    let data = {userId:userId,lstInside :lstInside};
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://smartmirror-api.azurewebsites.net/EditGadgetStatus';
    // let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ActualizarLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }

  actualizarOrder(userId,lstInside) {

    let data = {userId:userId,lstInside :lstInside};
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://smartmirror-api.azurewebsites.net/EditGadgetOrder';
    // let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ActualizarLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
}
