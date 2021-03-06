import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Http } from '@angular/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import {MatchesOrderPipe} from '../app/servicios/filter/filter';
import {WidgetService} from './data/widgets/widget.service';
import {UserService} from './data/users/user.service';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import { IonicStorageModule } from '@ionic/storage';
import {ModalOrderPageModule} from '../app/modal-order/modal-order.module';
import {InformationmirrorPageModule} from '../app/informationmirror/informationmirror.module';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import {Md5} from 'ts-md5/dist/md5';

const firebaseConfig = {
  apiKey: "AIzaSyBSISSOwwfhX6HrO8M8z683nGyJa77aIKo",
  authDomain: "proyectotdp-d9e6d.firebaseapp.com",
  databaseURL: "https://proyectotdp-d9e6d.firebaseio.com",
  projectId: "proyectotdp-d9e6d",
  storageBucket: "proyectotdp-d9e6d.appspot.com",
  messagingSenderId: "541429281292"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
     IonicModule.forRoot(),
     IonicStorageModule.forRoot(),
      AppRoutingModule,
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,
    HttpClientModule,
    InformationmirrorPageModule,
    ModalOrderPageModule,    
    HttpModule],
  providers: [
    StatusBar,
    SpeechRecognition,
    SplashScreen,
    Md5,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeStorage,    
    GooglePlus,
    UserService,
    WidgetService
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
