import { Component } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { GadgetsProvider} from '../servicios/gadgets/gadget';
import * as firebase from 'firebase/app';
import {AngularFireAuth} from 'angularfire2/auth';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nombre:string="";
  correo:string="";
  logeado:boolean = false;
  arreglo:Array<boolean>=[];
  constructor(
    private googlePlus: GooglePlus,
    private nativeStorage: NativeStorage,
    public loadingController: LoadingController,
    private router: Router,
    private platform: Platform,
    public alertController: AlertController,
    public proveedor:GadgetsProvider,
    private afAuth:AngularFireAuth
  ) { 
    
    this.obtenerGadgets();
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);
    
    this.googlePlus.login({
      'scopes': '', 
      'webClientId': environment.googleWebClientId, 
      'offline': true,
    })
      .then(user => {
        this.logeado= true;
        this.nombre=user.displayName;
        this.correo=user.email;
        console.log(user);        

        this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(user.idToken)
        ).then( data => {
          console.log(data);
        });
 
        this.nativeStorage.setItem('google_user', {
          name: user.displayName,
          email: user.email,
          picture: user.imageUrl
        })
          .then(() => {            
          }, (error) => {
            console.log(error);
          })
        loading.dismiss();
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

  async logout(){
    this.logeado = false;
    this.googlePlus.logout().then( res => {
      this.nombre="";
      this.correo="";
      this.logeado=false;
    });
  }

  async obtenerGadgets(){
    this.proveedor.obtenerGadgets().then(data => {
      console.log(data);
      this.arreglo=data;
    });
  }

  async changeEstado(event){
    this.proveedor.actualizar(this.arreglo).then(data => {
      if(data){
        console.log("SE ACTUALIZO");
        this.obtenerGadgets();
      }
      
    });
  }
}
