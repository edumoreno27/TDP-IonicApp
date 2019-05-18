import { PopupMenuPage } from './../popup-menu/popup-menu.page';
import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LoadingController, AlertController, Platform, ModalController, PopoverController } from '@ionic/angular';
import { ModalOrderPage } from '../modal-order/modal-order.page';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GadgetsProvider } from '../servicios/gadgets/gadget';
import { UsuariosProvider } from '../servicios/usuarios/usuarios';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { zip } from 'rxjs';
import { UsuarioService } from '../datos/usuarios/usuario.service';
import { md5 } from '../servicios/md5';

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
  repuesta: any;

  constructor(
    private googlePlus: GooglePlus, public popoverController: PopoverController,
    public loadingController: LoadingController,
    private router: Router, public _speech: SpeechRecognition,
    private platform: Platform, public _loadingController: LoadingController,
    public alertController: AlertController, public _usService: UsuarioService,
    public proveedor: GadgetsProvider, public modalController: ModalController,
    private afAuth: AngularFireAuth, public _us: UsuariosProvider
  ) {
    let variablestring = 'edu.david2706@gmail.com';
    console.log("variable antes dle md5", variablestring);

    console.log(md5(variablestring));


    this._us.cargar_storage().then(data => {
      console.log(this._us.usuario);
      this.usuario = this._us.usuario;
      this.numerohabitacion = this._us.habitacion;

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

  }

  ionViewDidEnter() {
    console.log("ENTRO");
    if (this.usuario) {
      this.obtenerGadgets(this.usuario.id);
    }

    this._us.cargar_storage().then(data => {
      console.log(this._us.usuario);
      this.usuario = this._us.usuario;
      this.numerohabitacion = this._us.habitacion;

    });
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
        this._usService.ObtenerUsuarioByEmail(md5(user.email)).then(response => {

          this.repuesta = response;
          console.log(this.repuesta);
          let idReference = undefined;
          let mirrorId = undefined;
          let codigohabitacion = undefined;
          if (this.repuesta.statusCode == 200) {
            idReference = this.repuesta.result.cliente.ClienteId;
            mirrorId = this.repuesta.result.mirrorId;
            codigohabitacion = this.repuesta.result.codigoHabitacion;
            this.numerohabitacion = this.repuesta.result.cliente.ClienteId;
          }


          if (this.repuesta.statusCode == 200) {
            this.nombre = user.displayName;
            this.correo = user.email;
            this.accesstoken = user.accessToken;

            console.log(user);

            this.afAuth.auth.signInWithCredential(
              firebase.auth.GoogleAuthProvider.credential(user.idToken)

            ).then(data => {

              console.log(data);
              console.log(idReference);
              this._us.registrarUsuario(user.email, user.serverAuthCode, this.accesstoken, idReference, mirrorId, codigohabitacion).then(usuario => {
                console.log(usuario);
                if (usuario.status == false) {
                  loading.dismiss();
                  this.presentAlert3();
                }
                else {
                  loading.dismiss();
                  this.usuario = usuario;
                  this._us.guardar_storage(usuario, this.numerohabitacion).then(menu => {
                    this.presentAlert4();

                  });
                }
              }

              );


            });

          } else if (this.repuesta.statusCode == 404) {
            loading.dismiss();
            this.presentarAlerta('Error', 'Correo del huésped no se encuentra registrado')
          }



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

  async presentAlert2() {
    const alert = await this.alertController.create({
      message: 'Ingresar número de habitación',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlert3() {
    const alert = await this.alertController.create({
      message: 'Ya existe un usuario asignado a esta habitación, pruebe con otra',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.logeado = false;
          this.googlePlus.logout();
        }
      }]
    });

    await alert.present();
  }

  async presentAlert4() {
    const alert = await this.alertController.create({
      header: 'Satisfactorio',
      message: 'Su cuenta fue asociada correctamente al Smart Mirror',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.logeado = true;

          this.obtenerGadgets(this._us.usuario.id);
          this.obtenerOrdenGadgets(this._us.usuario.id);
        }
      }]
    });

    await alert.present();
  }

  async presentarAlerta(header, Mensaje) {
    const alert = await this.alertController.create({
      header: header,
      message: Mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this.googlePlus.logout();
        }
      }]
    });

    await alert.present();
  }

  async presentarAlertaCerrarSesion(header, Mensaje) {
    const alert = await this.alertController.create({
      header: header,
      message: Mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this._us.delete().then(data => {

            console.log("USUARIO ID", this.usuario.id);
            console.log("ID REFERENCE", this.numerohabitacion);
          });
          this.logeado = false;
          this.googlePlus.disconnect();
        }
      }]
    });

    await alert.present();
  }


  async presentarAlertaError(header, Mensaje, data) {
    const alert = await this.alertController.create({
      header: header,
      message: Mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          console.log("ERROR", data.error);
        }
      }]
    });

    await alert.present();
  }
  async presentLoading(loading) {
    return await loading.present();
  }

  async logout() {

    const alert = await this.alertController.create({
      header: 'Cerrando Sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [{
        text: 'Cancelar',
        handler: () => {

        }
      }, {
        text: 'Aceptar',
        handler: async () => {
          let loadingElement = await this._loadingController.create({
            message: 'Cerrando sesión...',
            spinner: 'crescent'
          });
          loadingElement.present();
          this._us.cerrarsesion(this.usuario.id, this.numerohabitacion).then(usuario => {
            loadingElement.dismiss();
            console.log("USUARIO ELIMINADO", this._us.usuario);
            if (usuario.status == true) {

              this.presentarAlertaCerrarSesion('Sesión cerrada', 'Su sesión fue cerrada correctamente');

            } else {
              this.presentarAlertaError('Error', 'No se pudo cerrar sesión correctamente', usuario);
            }

          });
        }
      }]
    });

    await alert.present();



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
    let bool = true;
    for (let i = 0; i < arreglo2.length; i++) {
      for (let j = 0; j < this.arreglo.length; j++) {
        let variable = this.arreglo[j].description.toLowerCase();
        if ((arreglo2[i].includes('mostrar') && arreglo2[i].includes(variable)) || (arreglo2[i].includes('Mostrar') && arreglo2[i].includes(variable))) {
          // Found world  
          console.log(variable);
          // this.arreglo[j].isActive=true;   

          if (this.arreglo[j].isActive == false) {
            let elemtn = document.getElementById(this.arreglo[j].gadgetId);
            elemtn.click();
            bool = false;
            this.actualizargadgets();
            break;
          }
        }
        if ((arreglo2[i].includes('ocultar') && arreglo2[i].includes(variable)) || (arreglo2[i].includes('Ocultar') && arreglo2[i].includes(variable))) {
          // Found world  
          console.log(variable);
          // this.arreglo[j].isActive=false;          
          if (this.arreglo[j].isActive == true) {
            let elemtn = document.getElementById(this.arreglo[j].gadgetId);
            elemtn.click();
            bool = false;
            this.actualizargadgets();
            break;
          }

        }
      }
      if (bool == false) {
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

  async OpenPopOver(args) {
    const popover = await this.popoverController.create({
      component: PopupMenuPage,
      event: args,
      translucent: false
      
    });
    popover.onDidDismiss().then(data => {
      console.log("SE CERRO POP OVER", data);
      let datos = data.data;
      if (datos) {
        if (datos.Tipo == 2) {
          this.logout();
        } else if(datos.Tipo == 1){
          this.router.navigate(['/informationmirror']);
        }
      }

    })
    return await popover.present();
  }
}
