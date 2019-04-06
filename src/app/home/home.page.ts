import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LoadingController, AlertController, Platform, ModalController } from '@ionic/angular';
import { ModalOrderPage } from '../modal-order/modal-order.page';
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
  arreglo: Array<any> = [];
  orders: Array<any> = [];
  usuario: any;
  numerohabitacion: any;

  constructor(
    private googlePlus: GooglePlus,
    public loadingController: LoadingController,
    private router: Router, public _speech: SpeechRecognition,
    private platform: Platform,
    public alertController: AlertController,
    public proveedor: GadgetsProvider, public modalController: ModalController,
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
        this.obtenerOrdenGadgets(this.usuario.id);
        this.nombre = this.usuario.userName;
        this.correo = this.usuario.email;

      }
    });
    // let idnuevo = 'e21cd1c7-cf5a-491b-b72f-37e7d4db105f';
    // this.obtenerGadgets(idnuevo);
    // this.obtenerOrdenGadgets(idnuevo);
    this._speech.hasPermission()
      .then((hasPermission: boolean) => {

        if (!hasPermission) {
          this._speech.requestPermission()
            .then(
              () => console.log('Granted'),
              () => console.log('Denied')
            )
        }

      });
  }

  ionViewDidEnter(){
    console.log("ENTRO");
    this.obtenerGadgets(this.usuario.id);
  }

  ionViewDidLoad() {
    
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...'
    });
    loading.present();

    this.googlePlus.login({
      'scopes': 'https://mail.google.com/ https://www.googleapis.com/auth/calendar',
      'webClientId': environment.googleWebClientId,
      'offline': true,
    })
      .then(user => {
        this.logeado = true;
        this.nombre = user.displayName;
        this.correo = user.email;
        this.accesstoken = user.accessToken;
        console.log(user);

        this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user.idToken)

        ).then(data => {

          console.log(data);

          this._us.registrarUsuario(user.email, user.displayName, user.serverAuthCode, this.accesstoken, this.numerohabitacion).then(usuario => {

            this._us.guardar_storage(usuario, this.numerohabitacion).then(menu => {
              loading.dismiss();
              this.obtenerGadgets(this._us.usuario.id);
              this.obtenerOrdenGadgets(this._us.usuario.id);
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
    this.logeado = false;
    this.googlePlus.disconnect();

    this._us.delete();
    this._us.cerrarsesion(this._us.usuario.id, this._us.habitacion).then(usuario => {

    });
  }

  async obtenerGadgets(id) {
    this.proveedor.obtenerGadgets(id).then(data => {
      console.log(data);
      this.arreglo = data;
    });
  }

  async obtenerOrdenGadgets(id) {
    this.proveedor.obtenerOrderGadgets(id).then(data => {
      console.log(data);
      this.orders = data;
    });
  }
  async changeEstado(event) {

  }
  async actualizargadgets() {
    this.proveedor.actualizar(this._us.usuario.id, this.arreglo).then(data => {
      if (data) {
        this.arreglo = data;
        // this.obtenerGadgets(1);
        console.log("SE ACTUALIZO");

      }

    });
  }
  async abrirOrden(orden) {
    this.proveedor.obtenerOrderGadgets(this._us.usuario.id).then(data => {
      this.orders = data;
      this.proveedor.guardar_storage(this.orders).then(data => {
        this.router.navigate(['/modal-order', { orden: orden, orders: this.orders }]);
      });

    });


  }
  startGrabation() {
    this._speech.startListening()
      .subscribe(
        (matches: Array<any>) => {
          this.Analizar(matches);
          console.log(matches)

        },
        (onerror) => console.log('error:', onerror)
      )
  }
  Analizar(arreglo2) {
    let bool=true;
    for (let i = 0; i < arreglo2.length; i++) {
      for(let j=0 ; j<this.arreglo.length;j++){
        let variable =this.arreglo[j].description.toLowerCase();
        if ((arreglo2[i].includes('mostrar') &&  arreglo2[i].includes(variable) )|| (arreglo2[i].includes('Mostrar') &&  arreglo2[i].includes(variable) ) ) {
          // Found world  
          console.log(variable);
          // this.arreglo[j].isActive=true;     
          let elemtn=document.getElementById(this.arreglo[j].gadgetId);
          elemtn.click();
          bool=false;
          break;
          
        }
        if ((arreglo2[i].includes('ocultar') &&  arreglo2[i].includes(variable) )|| (arreglo2[i].includes('Ocultar') &&  arreglo2[i].includes(variable) ) ) {
          // Found world  
          console.log(variable);
          // this.arreglo[j].isActive=false;          
          let elemtn=document.getElementById(this.arreglo[j].gadgetId);
          elemtn.click();
          bool=false;
          break;
          
        }
      }  
      if(bool==false){
        break;
      }    
    }
    for (let i = 0; i < arreglo2.length; i++) {
      if (arreglo2[i].includes('actualizar')) {
        this.actualizargadgets();
        break;
      }

    }
  }
}
