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
    
    let url = 'http://edumoreno27-001-site2.etempurl.com/GetGadgetStatus';
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
    
    let url = 'http://edumoreno27-001-site2.etempurl.com/GetGadgetOrder';
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
    let url = 'http://edumoreno27-001-site2.etempurl.com/EditGadgetStatus';
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
    let url = 'http://edumoreno27-001-site2.etempurl.com/EditGadgetOrder';
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
