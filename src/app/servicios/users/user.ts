import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from '../../data/users/user.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class UserProvider {

  public user: any;
  public room: any;

  constructor(public http: Http, public _us: UserService, public storage: Storage) {
    this.loadStorage();

  }

  registerUser(email,refreshtoken,accestoken,idReference,mirrorId,roomNumber) {

    return this._us.registerUser(email,refreshtoken,accestoken,idReference,mirrorId,roomNumber);

  }

  signOut(id, roomNumber) {
    return this._us.signOut(id, roomNumber);
  }
  
  saveStorage(user, room) {
    let promise = new Promise((resolve, reject) => {
      this.storage.set("user", JSON.stringify(user))
        .then(() => {          
          this.user = user;
          resolve();
        }, (error) => {
          resolve();          
        })

      this.storage.set("room", JSON.stringify(room))
        .then(() => {
          this.room = room;
          resolve();
        }, (error) => {
          resolve();          
        })

    });
    return promise;
  }

  loadStorage() {

    let promesa = new Promise((resolve, reject) => {
      this.storage.get("user")
        .then(user => {          
          if (user) {
            this.user = JSON.parse(user);
          }
          resolve();
        })

      this.storage.get("room")
        .then(room => {
          if (room) {
            this.room = room;
          }
          resolve();
        })
    });
    return promesa;
  }
  delete() {
    let promesa = new Promise((resolve, reject) => {
    this.storage.remove('user').then(data => {
      this.user=null;
    });
    this.storage.remove('room').then(data => {
      this.room=null;
      resolve();
    });
  });
  return promesa;
  }
}
