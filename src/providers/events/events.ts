import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { EventosClass } from '../../classes/eventos';

@Injectable()
export class EventsProvider {

  eventos: any[] = [];
  lastKey:string = undefined;
  numAsistentes: number = 0;

  constructor(public http: Http, private afDB: AngularFireDatabase) {

  }

  activar_listener_db() {
    firebase.database().ref('/eventos')
      .on('child_removed', (snapshot) => {
        console.log("Elemento eliminado");
        console.log(snapshot.val());
        for(let i = 0; i<this.eventos.length; i++) {
          if(snapshot.key === this.eventos[i].key) {
            this.eventos.splice(i, 1);
          }
        }
      });

    firebase.database().ref('/eventos')
      .on('child_changed', (snapshot) => {
        console.log("Elemento modificado");
        console.log("snapshot");
        console.log(JSON.stringify(snapshot.val()));
        this.cargar_eventos();
      });

    firebase.database().ref('/asistentes')
      .on('child_changed', (snapshot) => {
        console.log("ASISTENTE MODIFICADO");
        console.log("snapshot");
        console.log(JSON.stringify(snapshot.val()));
        this.cargar_eventos();
      });

    // firebase.database().ref('/asistentes')
    //   .on('child_removed', (snapshot) => {
    //     console.log("ASISTENTE ELIMINADO");
    //     console.log("snapshot");
    //     console.log(snapshot.val());
    //   });
  }

  cargar_eventos() {

    let promesa = new Promise( (resolve, reject) => {

      this.afDB.list('/eventos',{
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

      // var firstQuery = firebase.database().ref('/eventos').orderByKey().limitToFirst(2);
      // firstQuery.on('child_changed', (snapshot) => {
      //
      //   console.log("DENTRO DEL CHILD_ADDED");
      //   // Vaciamos el array para recargarlo de nuevo
      //   this.eventos = [];
      //   this.lastKey = undefined;
      //
      //   console.log("TAMAÑO DEL ARRAY DE EVENTOS");
      //   console.log(this.eventos.length);
      //
      //   // Recorremos los datos consultados
      //
      //   /* Si el item actual no es igual al último procesado anteriormente, lo introducimos al array
      //     Antes debemos asignarlo a un objeto provisional para poder añadirle el parámetro 'asistentes'
      //   */
      //
      //     if(this.lastKey !== snapshot.key) {
      //
      //       let evento = snapshot.val();
      //       evento.key = snapshot.key;
      //
      //       this.num_asistentes_por_evento(snapshot.key, evento)
      //         .then( ()=> {
      //           this.eventos.push(evento);
      //         });
      //
      //     }
      //
      //     this.lastKey = snapshot.key;
      //
      //   });
      //
      //   resolve(true);
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

      this.afDB.list('/asistentes/' + eventKey).subscribe( data => {

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

      // firebase.database().ref('/asistentes/' + eventKey)
      //   .on('value', (snapshot) => {
      //     snapshot.forEach((snapchild) => {
      //       console.log(snapchild.val());
      //       if(snapchild.val()._confirmado) {
      //         numAsistentesActuales+=1;
      //       }
      //       return true;
      //     });
      //     evento.asistentes = numAsistentesActuales;
      //     resolve(true);
      //   })

    });


    return promesa;

  }

  comprobar_si_asiste(ID_Evento: string, UID: string) {
    let promesa = new Promise((resolve, reject) => {

      this.afDB.list('/asistentes/' + ID_Evento).subscribe( data => {
        for(let x = 0; x<data.length; x++) {
          if(data[x]._UID === UID) {
            console.log("SI ASISTE");
            resolve(true);
            return;
          }
        }
        resolve(false);
        return;
      });

    });


    return promesa;
  }

  comprobar_asistencia_confirmada(ID_Evento: string, UID: string) {
    let promesa = new Promise((resolve, reject) => {

      this.afDB.list('/asistentes/' + ID_Evento).subscribe( data => {
        for(let x = 0; x<data.length; x++) {
          if(data[x]._UID === UID && data[x]._confirmado) {
            resolve(true);
            return;
          }
        }
        resolve(false);
        return;
      });

    });


    return promesa;
  }

}
