import { PopupMenuPage } from './../popup-menu/popup-menu.page';
import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { LoadingController, AlertController, Platform, ModalController, PopoverController } from '@ionic/angular';
import { ModalOrderPage } from '../modal-order/modal-order.page';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { WidgetProvider } from '../servicios/widgets/widget';
import { UserProvider } from '../servicios/users/user';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { zip } from 'rxjs';
import { UserService } from '../data/users/user.service';
import { md5 } from '../servicios/md5';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  name: string = "";
  email: string = "";
  accesstoken: string = "";
  logged: boolean = false;
  widgetarray: Array<any> = [];
  orders: Array<any> = [];
  user: any;
  roomnumber: any;
  response: any;

  constructor(
    private googlePlus: GooglePlus, public popoverController: PopoverController,
    public loadingController: LoadingController,
    private router: Router, public _speech: SpeechRecognition,
    private platform: Platform, public _loadingController: LoadingController,
    public alertController: AlertController, public _usService: UserService,
    public _wp: WidgetProvider, public modalController: ModalController,
    private afAuth: AngularFireAuth, public _us: UserProvider
  ) {

    this._us.loadStorage().then(data => {
      
      this.user = this._us.user;
      this.roomnumber = this._us.room;      
      if (this.user != undefined) {        
        this.logged = true;
        this.obtainWidgets(this.user.id);
        this.obtainOrderWidgets(this.user.id);
        this.name = this.user.userName;
        this.email = this.user.email;
      }
    });

  }

  ionViewDidEnter() {
    
    if (this.user) {
      this.obtainWidgets(this.user.id);
    }

    this._us.loadStorage().then(data => {      
      this.user = this._us.user;
      this.roomnumber = this._us.room;

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
        this._usService.obtainUserByEmail(md5(user.email)).then(response => {

          this.response = response;          
          let idReference = undefined;
          let mirrorId = undefined;
          let roomcode = undefined;
          
          if (this.response.statusCode == 200) {
            idReference = this.response.result.cliente.ClienteId;
            mirrorId = this.response.result.mirrorId;
            roomcode = this.response.result.codigoHabitacion;
            this.roomnumber = this.response.result.cliente.ClienteId;
            this.name = user.displayName;
            this.email = user.email;
            this.accesstoken = user.accessToken;            

            this.afAuth.auth.signInWithCredential(
              firebase.auth.GoogleAuthProvider.credential(user.idToken)

            ).then(data => {

              this._us.registerUser(user.email, user.serverAuthCode, this.accesstoken, idReference, mirrorId, roomcode).then(user => {
                
                if (user.status == false) {
                  loading.dismiss();
                  this.presentAlert3();
                }
                else {
                  loading.dismiss();
                  this.user = user;
                  this._us.saveStorage(user, this.roomnumber).then(menu => {
                    this.presentAlert4();
                  });
                }
              }

              );


            });

          } else if (this.response.statusCode == 404) {
            loading.dismiss();
            this.presentAlert5('Error', 'email del huésped no se encuentra registrado')
          }
        });
      }, err => {
        
        if (!this.platform.is('cordova')) {
          this.presentAlert();
        }
        loading.dismiss();
      })
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      message: 'Cordova no está disponible para PC. Prueba utilizando un dispositivo real o emulador.',
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
          this.logged = false;
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
          this.logged = true;
          this.obtainWidgets(this._us.user.id);
          this.obtainOrderWidgets(this._us.user.id);
        }
      }]
    });
    await alert.present();
  }

  async presentAlert5(header, Mensaje) {
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

  async presentAlert6(header, Mensaje) {
    const alert = await this.alertController.create({
      header: header,
      message: Mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          this._us.delete().then(data => {
          });
          this.logged = false;
          this.googlePlus.disconnect();
        }
      }]
    });

    await alert.present();
  }


  async presentAlert7(header, Mensaje, data) {
    const alert = await this.alertController.create({
      header: header,
      message: Mensaje,
      buttons: [{
        text: 'Aceptar',
        handler: () => {
          
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
          this._us.signOut(this.user.id, this.roomnumber).then(user => {
            loadingElement.dismiss();
            
            if (user.status == true) {

              this.presentAlert6('Sesión cerrada', 'Su sesión fue cerrada correctamente');

            } else {
              this.presentAlert7('Error', 'No se pudo cerrar sesión correctamente', user);
            }

          });
        }
      }]
    });

    await alert.present();
  }

  async obtainWidgets(id) {
    this._wp.obtainWidgets(id).then(data => {
      
      this.widgetarray = data;
    });
  }

  async obtainOrderWidgets(id) {
    this._wp.obtainOrderWidgets(id).then(data => {      
      this.orders = data;
    });
  }

  async updateStateWidget() {
    this._wp.updateStateWidget(this._us.user.id, this.widgetarray).then(data => {
      if (data) {
        this.widgetarray = data;
      }

    });
  }
  async openOrder(order) {
    this._wp.obtainOrderWidgets(this._us.user.id).then(data => {
      this.orders = data;
      this._wp.saveStorage(this.orders).then(data => {
        this.router.navigate(['/modal-order', { order: order, orders: this.orders }]);
      });

    });


  }

  async OpenPopOver(args) {
    const popover = await this.popoverController.create({
      component: PopupMenuPage,
      event: args,
      translucent: false
      
    });
    popover.onDidDismiss().then(data => {
      
      let datos = data.data;
      if (datos) {
        if (datos.Type == 2) {
          this.logout();
        } else if(datos.Type == 1){
          this.router.navigate(['/informationmirror']);
        }
      }

    })
    return await popover.present();
  }
}
