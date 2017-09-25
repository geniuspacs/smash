import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { DatosUsuarioPage } from '../pages/datos-usuario/datos-usuario';

import { UserProvider } from '../providers/user/user';
import { PushProvider } from '../providers/push/push';

import * as firebase from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private usProv: UserProvider, 
    private pushProv: PushProvider) {
      platform.ready().then(() => {

        firebase.auth().onAuthStateChanged( (usuarioActivo) => {
        firebase.auth().currentUser == usuarioActivo;

        if(firebase.auth().currentUser) {
          this.usProv.existe_datos_usuario().then( (existenDatos) => {
            console.log("Existen datos de usuario??");
            if(existenDatos) {
              console.log("Existen");
              //this.pushProv.setPush();
              this.rootPage = TabsPage;
            } else {
              this.rootPage = DatosUsuarioPage;
            }
          });
        } else {
          this.rootPage = LoginPage;
        }
      });

        statusBar.styleDefault();
        splashScreen.hide();
      });
    }
}

