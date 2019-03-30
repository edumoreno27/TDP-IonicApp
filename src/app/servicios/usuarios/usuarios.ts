import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { UsuarioService } from '../../datos/usuarios/usuario.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Storage } from '@ionic/storage';
@Injectable({
    providedIn: 'root'
})
export class UsuariosProvider {

    public usuario:any;
    public habitacion:any;

    constructor(public http: Http, public _us: UsuarioService,public storage:Storage) 
    {
        this.cargar_storage();

     }

     registrarUsuario(email,username,refreshtoken,accestoken,roomNumber) {

        return this._us.registrarUsuario(email,username,refreshtoken,accestoken,roomNumber);

    }

    cerrarsesion(id ,roomNumber){
        return this._us.cerrarsesion(id,roomNumber);
      }

    guardar_storage(user,habitacion){
        let promesa = new Promise((resolve, reject) => {
            this.storage.set("user", JSON.stringify(user))
            .then(() => {  console.log('usuarioGuardado');  
            console.log(user);
            this.usuario=user;         
            resolve();
            }, (error) => {
                resolve();
              console.log(error);
            })

            this.storage.set("room", JSON.stringify(habitacion))
            .then(() => {              
            this.habitacion=habitacion;         
            resolve();
            }, (error) => {
                resolve();
              console.log(error);
            })

        });
        return promesa;
    }

    cargar_storage(){

        let promesa = new Promise((resolve, reject) => {
            this.storage.get("user")
            .then(usuario => {
                console.log(usuario);
              if (usuario) {
                this.usuario = JSON.parse(usuario);
              }
              resolve();
            })

            this.storage.get("room")
            .then(room => {
                
              if (room) {
                this.habitacion=room;
              }
              resolve();
            })
    });
    return promesa;
    }
    delete(){
        this.storage.remove('user').then(data =>{            
        });
        this.storage.remove('room').then(data =>{            
        });
    }
}
