import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class GadgetsService {

  constructor(public http: Http) { }

  obtenerGadgets() {

    let data = {};
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ObtenerLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
  actualizar(vistas) {

    let data = {vistas:vistas};
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl+'http://edumoreno27-001-site1.etempurl.com/Gadget/ActualizarLista';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );


  }
}
