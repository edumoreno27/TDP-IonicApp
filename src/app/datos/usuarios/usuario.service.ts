import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(public http:Http) { }

  registrarUsuario(email,refreshtoken,accestoken,idReference,mirrorId) {
    
    let data = {email:email,      
        refreshtoken: refreshtoken,
          accesstoken: accestoken,          
          idReference:idReference,
          mirrorId:mirrorId};

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl + 'http://smartmirror-api.azurewebsites.net/CreateUser';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { 
        let error=e.json();
        return error;
       }

      );


  }

  cerrarsesion(id ,roomNumber){
    let data = {id:id,
   
          roomNumber: +roomNumber};

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl + 'http://smartmirror-api.azurewebsites.net/AfterLogout';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

      );
    
  }

  obtenerUsuario(roomNumber){
    
    let url2 = 'https://tp-ires-api.azurewebsites.net/v1/management/habitacion/';
    let url = url2;
    return new Promise(resolve => {
      this.http.get(url + roomNumber).subscribe(data => {

        let rs = data.json();
        console.log(rs);
        resolve(rs);
      }, err => {
        let rs = err.json();
        console.log(rs);
        resolve(rs);
      });
    });
  }
  
}
