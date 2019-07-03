import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private cors:string='https://cors-anywhere.herokuapp.com/';

  constructor(public http:Http) { }

  registerUser(email,refreshtoken,accestoken,idReference,mirrorId,roomNumber) {
    
    let data = {email:email,      
        refreshtoken: refreshtoken,
          accesstoken: accestoken,          
          idReference:idReference,
          mirrorId:mirrorId,
          roomNUmber:roomNumber};
    
    let url =  this.cors+'http://edumoreno27-001-site2.etempurl.com/CreateUser';
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { 
        let error=e.json();
        return error;
       }
      );
  }

  signOut(id ,roomNumber){
    let data = {id:id,
      roomNumber: +roomNumber};    

    let url = this.cors+'http://edumoreno27-001-site2.etempurl.com/AfterLogout';
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { return e; }
      );
  }

  obtainUser(roomNumber){
    
    let url = 'https://tp-ires-api.azurewebsites.net/v1/management/habitacion/';
    
    return new Promise(resolve => {
      this.http.get(url + roomNumber).subscribe(data => {

        let rs = data.json();
        
        resolve(rs);
      }, err => {
        let rs = err.json();
        
        resolve(rs);
      });
    });
  }

  obtainUserByEmail(email){
    
    let url = 'https://tp-ires-api.azurewebsites.net/v1/management/email/';
    
    return new Promise(resolve => {
      this.http.get(url + email).subscribe(response => {
        let rs = response.json();        
        resolve(rs);
      }, err => {
        let rs = err.json();        
        resolve(rs);
      });
    });
  }
}
