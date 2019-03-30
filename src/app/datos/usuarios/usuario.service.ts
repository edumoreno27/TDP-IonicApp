import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(public http:Http) { }

  registrarUsuario(email,username,refreshtoken,accestoken,roomNumber:number) {
    
    let data = {email:email,
      userName: username,
        refreshtoken: refreshtoken,
          accesstoken: accestoken,
          roomNumber: +roomNumber};

    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let url = proxyurl + 'http://smartmirror-api.azurewebsites.net/CreateUser';
    return this.http.post(url, data)
      .toPromise()
      .then(data => {
        let rs = data.json()
        return rs;
      }).catch(e => { console.log(e); return e; }

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
}
