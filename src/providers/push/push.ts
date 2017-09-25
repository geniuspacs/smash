import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { FCM } from '@ionic-native/fcm';

import * as firebase from 'firebase/app';

@Injectable()
export class PushProvider {

  solicitudesPendientes: Number = undefined;

  constructor(public http: Http, private fcm: FCM) {
    
  }

  setPush() {

    this.fcm.onNotification()
      .subscribe((data) => {
        alert("Notificacion recibida");
      });

    this.refrescar_token();
  }


  private refrescar_token() {
    this.fcm.getToken().then(token => {
      console.log("mi token: " + token);

      firebase.database().ref('/usuarios/' + firebase.auth().currentUser.uid).child('tokenNotificaciones').set(token);

    });
  }

}
