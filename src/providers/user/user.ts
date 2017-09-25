import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Injectable()
export class UserProvider {

  constructor(public http: Http, private afDB: AngularFireDatabase) {
    
  }

  existe_datos_usuario() {
    
        let promesa = new Promise( (resolve, reject) => {
          this.afDB.list('/usuarios/' + firebase.auth().currentUser.uid).subscribe( data => {
    
            console.log(JSON.stringify(data));
    
            if(data.length === 0) {
              console.log("Devolvemos falso");
              console.log(JSON.stringify(firebase.auth().currentUser));
              resolve(false);
              return;
            } else {
              console.log("Devolvemos true");
              console.log(JSON.stringify(data));
              resolve(true);
              return;
            }
          })
        });
    
        return promesa;
      }

      eliminar_token() {
        firebase.database().ref('/usuarios/' + firebase.auth().currentUser.uid).child('tokenNotificaciones').remove();
      }

}
