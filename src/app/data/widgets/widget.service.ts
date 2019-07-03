import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class WidgetService {
  
  private cors:string='https://cors-anywhere.herokuapp.com/';
  constructor(public http: Http) { }

  obtainWidgets(id) {

    let data = {
      id:id
    };    
    
    let url = this.cors+'http://edumoreno27-001-site2.etempurl.com/GetGadgetStatus';
    
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { return e; }

      );


  }

  obtainOrderWidgets(id) {

    let data = {
      id:id
    };
       
    let url =  this.cors+'http://edumoreno27-001-site2.etempurl.com/GetGadgetOrder';
    
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { return e; }

      );


  }
  
  updateStateWidget(userId,lstInside) {

    let data = {userId:userId,lstInside :lstInside};
    
    let url =  this.cors+'http://edumoreno27-001-site2.etempurl.com/EditGadgetStatus';
    
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { return e; }

      );


  }

  updateOrderWidget(userId,lstInside) {

    let data = {userId:userId,lstInside :lstInside};
    
    let url =  this.cors+'http://edumoreno27-001-site2.etempurl.com/EditGadgetOrder';
    
    return this.http.post(url, data)
      .toPromise()
      .then(response => {
        let rs = response.json()
        return rs;
      }).catch(e => { return e; }

      );


  }
}
