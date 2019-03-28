import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GadgetsProvider } from '../servicios/gadgets/gadget';
import { UsuariosProvider } from '../servicios/usuarios/usuarios';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nombre: string = "";
  correo: string = "";
  accesstoken: string = "";
  logeado: boolean = false;
  arreglo: Array<boolean> = [];
  usuario: any;
  constructor(
    private googlePlus: GooglePlus,

    public loadingController: LoadingController,
    private router: Router,
    private platform: Platform,
    public alertController: AlertController,
    public proveedor: GadgetsProvider,
    private afAuth: AngularFireAuth, public _us: UsuariosProvider
  ) {

    this._us.cargar_storage().then(data => {
      console.log(this._us.usuario);
      this.usuario = this._us.usuario;


      console.log(this.usuario);
      if (this.usuario != undefined) {
        console.log(" ENTRO AQUI");
        this.logeado = true;
        this.obtenerGadgets(this.usuario.id);
        this.nombre = this.usuario.userName;
        this.correo = this.usuario.email;

      }
    });


  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    loading.present();

    this.googlePlus.login({
      'scopes': '',
      'webClientId': environment.googleWebClientId,
      'offline': true,
    })
      .then(user => {
        this.logeado = true;
        this.nombre = user.displayName;
        this.correo = user.email;
        this.accesstoken = user.accessToken;


        this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user.idToken)
        ).then(data => {

          this._us.registrarUsuario(user.email, user.displayName, data.refreshToken, this.accesstoken).then(usuario => {

            this._us.guardar_storage(usuario).then(menu => {
              loading.dismiss();
              this.obtenerGadgets(this._us.usuario.id);
            });



          }

          );


        });


      }, err => {
        console.log(err);
        if (!this.platform.is('cordova')) {
          this.presentAlert();
        }
        loading.dismiss();
      })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Cordova is not available on desktop. Please try this in a real device or in an emulator.',
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentLoading(loading) {
    return await loading.present();
  }

  async logout() {

    this.googlePlus.disconnect();
    this.logeado = false;
    this._us.delete();
    
    // this.googlePlus.logout().then(res => {
    //   this.nombre = "";
    //   this.correo = "";
      
    // });
  }

  async obtenerGadgets(id) {
    this.proveedor.obtenerGadgets(id).then(data => {
      console.log(data);
      this.arreglo = data;
    });
  }

  async changeEstado(event) {
    this.proveedor.actualizar(this._us.usuario.id, this.arreglo).then(data => {
      if (data) {
        this.arreglo = data;
        console.log("SE ACTUALIZO");

      }

    });
  }
}
