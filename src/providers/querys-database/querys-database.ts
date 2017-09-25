import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase/app';

@Injectable()
export class QuerysDatabaseProvider {

  eventos: any[] = [];
  lastKey: string = undefined;

  constructor(public http: Http, private afDatabase: AngularFireDatabase) {
   
  }

  cargar_eventos() {
    
        let promesa = new Promise( (resolve, reject) => {
    
          this.afDatabase.list('/eventos',{
            query: {
              orderByKey: true,
              limitToFirst: 2
            }
          }).subscribe( data => {
    
            this.eventos = [];
            this.lastKey = undefined;
    
            console.log(JSON.stringify(data));
            console.log(data.length);
    
            for(let i = 0; i<data.length; i++) {
              if(data[i].$key !== this.lastKey) {
                this.num_asistentes_por_evento(data[i].$key, data[i])
                    .then( () => {
                      data[i].key = data[i].$key;
                      this.eventos.push(data[i]);
                    });
    
                this.lastKey = data[i].$key;
              }
            }
    
            console.log("DEFINIDA LA LASTKEY: " + this.lastKey);
            resolve(true);
          });
        });
    
        return promesa;
    
      }

  cargar_siguientes_eventos() {
    let promesa = new Promise( (resolve, reject) => {

      console.log("IMPRIMIMOS LASTKEY");
      console.log(this.lastKey);

      var nextQuery = firebase.database().ref('/eventos').orderByKey().startAt(this.lastKey).limitToFirst(2)
          .on('value', (data) => {
            data.forEach((dataChild) => {

              if(data.numChildren() === 1 && this.lastKey === dataChild.key) {
                console.log("No hay más elementos");
                resolve(false);
                return;
              }

              if(this.lastKey !== dataChild.key) {
                let evento = dataChild.val();
                evento.key = dataChild.key;

                this.num_asistentes_por_evento(dataChild.key, evento)
                  .then( ()=> {
                    this.eventos.push(evento);
                  });
              }

              this.lastKey = dataChild.key;
              return false;

            });

            resolve(true);
          });
    });
    return promesa;

  }

  num_asistentes_por_evento(eventKey:string, evento: any) {
    
        let promesa = new Promise((resolve, reject) => {
          let numAsistentesActuales = 0;
          console.log("Consultamos asistentes");
    
          this.afDatabase.list('/asistentes/' + eventKey).subscribe( data => {
    
            console.log(data.length);
    
            for(let i = 0; i<data.length; i++) {
              console.log(data[i]);
              if(data[i]._confirmado) {
                numAsistentesActuales+=1;
              }
            }
    
            evento.asistentes = numAsistentesActuales;
            resolve(true);
    
          });
    
        });
    
    
        return promesa;
    
      }

}
