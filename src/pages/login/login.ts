import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { AuthProvider } from '../../providers/auth/auth';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email:string = "";
  password:string = "";

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private loadingCtrl: LoadingController,
            private authProv: AuthProvider) {
  }

  logueo_comun() {
    
    this.mostrar_loading();

    this.authProv.verifica_usuario(this.email, this.password).then( (result) => {
      this.loading.dismiss();
    }, (error) => {
      this.loading.dismiss();
    }).catch(error => {
      this.loading.dismiss();
    });
  }
    
  logueo_googleplus() {
    console.log("Nos vamos a loguear con Google Plus");
    this.authProv.verifica_usuario_google().then( (result) => {
    }, (error) => {
      console.log("error 1");
      console.log(JSON.stringify(error));
    }).catch(error => {
      console.log("error 2");
      console.log(JSON.stringify(error));
    });
  }

  logueo_facebook() {

    this.authProv.verifica_usuario_facebook().then( (result) => {
    }, (error) => {
      console.log("error 1");
      console.log(JSON.stringify(error));
    }).catch(error => {
      console.log("error 2");
      console.log(JSON.stringify(error));
    });
  }

  logueo_twitter() {

    this.authProv.verifica_usuario_twitter().then( (result) => {
    }, (error) => {
      console.log("error 1");
      console.log(JSON.stringify(error));
    }).catch(error => {
      console.log("error 2");
      console.log(JSON.stringify(error));
    });
  }

  private mostrar_loading() {
    this.loading = this.loadingCtrl.create({
      content: "Comprobando los datos..."
    });

    this.loading.present();
  }

}
