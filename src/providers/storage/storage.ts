import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ToastController, AlertController } from 'ionic-angular'
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { AuthProvider } from '../auth/auth';
import { EventsProvider } from '../events/events';

import { EventosClass } from '../../classes/eventos';
import { UsuarioAsistente } from '../../classes/usuarioAsistente';

// PROVIDER ENCARGADO DE INSERTAR, MODIFICAR Y ELIMINAR DATOS DE LA BASE DE DATOS
@Injectable()
export class StorageProvider {

  private CARPETA_IMAGENES = 'img';
  private EVENTOS = 'eventos';

  constructor(public http: Http, private toastCtrl: ToastController, private afDB: AngularFireDatabase, private authProv: AuthProvider, private alertCtrl: AlertController,
              private eventsProv: EventsProvider) {

  }

  subir_archivo(uID: string, archivo:EventosClass) {
    let promesa = new Promise( (resolve, reject) => {
      console.log("SUBIR ARCHIVO");

      let storageRef = firebase.storage().ref();
      let nombreArchivo = new Date().valueOf();
      archivo.nombre_fichero_imagen = nombreArchivo.toString();

      let uploadTask: firebase.storage.UploadTask =
                      storageRef.child(`${ this.CARPETA_IMAGENES }/${ firebase.auth().currentUser.uid }/${ nombreArchivo }`)
                      .putString(archivo.img, 'base64', {contentType: 'image/jpeg'});

                      uploadTask.catch( (error) => {
                        console.log("Error uploadTask: " + JSON.stringify(error));
                        this.mostrar_toast("Error uploadTask: " + JSON.stringify(error));
                      });

                      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                                    (snapshot)=>{ // Saber el avance del archivo. El snapshot trae todos los detalles del archivo (tamaño, tamaño subido, etc...)

                                    }, (error)=> { // Manejo de errores

                                      console.error("Error al subir archivo ", JSON.stringify(error));
                                      this.mostrar_toast("Error al subir archivo: " + JSON.stringify(error));
                                      reject(error);

                                    }, () => { // Termina el proceso

                                      let url = uploadTask.snapshot.downloadURL;
                                      this.mostrar_toast("Imagen cargada");
                                      this.registrar_evento_db(archivo, url)
                                      .then( (success) => {
                                        if(success) {
                                          resolve(true);
                                        }
                                      });

                                    });

    });

    return promesa;
  }

  private registrar_evento_db(archivo:EventosClass, url:string) {
    let promesa = new Promise( (resolve, reject) => {
      let datosASubir:archivoSubir = {
        img: url,
        titulo: archivo.titulo,
        descripcion: archivo.descripcion,
        ubicacion: archivo.ubicacion,
        fecha: archivo.fecha,
        hora: archivo.hora,
        num_max_asistentes: archivo.num_max_asistentes,
        tipo_evento: archivo.tipo_evento,
        publico: archivo.publico,
        creador_evento: archivo.creador_evento,
        fecha_publicacion: archivo.fecha_publicacion,
        nombre_fichero_imagen: archivo.nombre_fichero_imagen
      };

      let $key = this.afDB.database.ref(`/${this.EVENTOS}`).push(datosASubir).key;
      datosASubir.$key = $key;

      let asistente = new UsuarioAsistente();
      asistente.uid = firebase.auth().currentUser.uid;
      asistente.nombre_usuario = archivo.creador_evento;
      asistente.nombre_completo = firebase.auth().currentUser.displayName;
      asistente.email = firebase.auth().currentUser.email;
      asistente.confirmado = true;

      this.add_asistente(asistente, $key).then( (success)=> {
        if(success) {
          this.eventsProv.num_asistentes_por_evento(datosASubir.$key, archivo)
            .then( (success) => {

              if(success) {
                resolve(true);
                return;
              } else {
                resolve(false);
                return;
              }

            });
        } else {
          resolve(false);
          return;
        }
      });
    });

    return promesa;
  }

  add_asistente(asistente: UsuarioAsistente, idEvento: string) {

    let promesa = new Promise( (resolve, reject) => {
      console.log("VAMOS A AÑADIR AL ASISTENTE");

      this.afDB.database.ref('/asistentes/' + idEvento)
      .push(asistente)
      .then( () => {
        console.log("Asistente añadido");
        resolve(true);
        return;
      })
      .catch( (error) => {
        this.mostrar_alerta("Error de inserción", "Se produjo un error al añadir al asistente al evento. Por favor, inténtelo de nuevo.");
        resolve(false);
        return;
      });


    });

    return promesa;

  }

  eliminar_asistente(idEvento: string, UID: string) {
    let promesa = new Promise( (resolve, reject) => {
      firebase.database().ref('/asistentes/' + idEvento)
          .once('value',(snapshot)=>{
            snapshot.forEach((snapchild)=> {
              console.log(snapchild.key);
              if(snapchild.val()._UID === UID) {
                firebase.database().ref('/asistentes/' + idEvento + "/" + snapchild.key).remove();
                resolve(true);
                return false;
              }
            });
          });
    });

    return promesa;
  }

  guardar_datos_usuario(email:string, nombre:string, nombre_usuario:string) {

    let promesa = new Promise( (resolve, reject) => {
      this.afDB.database.ref('/usuarios/' + this.authProv.UID).set({
        email: email,
        nombre_completo: nombre,
        nombre_usuario: nombre_usuario
      });

      resolve(true);
    });

    return promesa;
  }

  consultar_nombres_usuario(nombre_usuario:string) {
    let promesa = new Promise( (resolve, reject) => {
      let result = this.afDB.list('/usuarios').subscribe( data => {
        for(let i = data.length-1; i>=0; i--) {
          let username = data[i].nombre_usuario;

          if(nombre_usuario === username) {
            resolve(false);
            return;
          }

        }

        resolve(true);
        return;
      });
    });

    return promesa;
  }

  consultar_nombre_usuario(): string {
    var nameUs = "";
    this.afDB.list('/usuarios/' + this.authProv.UID).subscribe( data => {
      console.log("consulta nombre usuario");
      console.log(data[2].$value);
      nameUs = data[2].$value;
    });
    return nameUs;
  }

  eliminar_evento(evento: any) {
    let promesa = new Promise( (resolve, reject) => {
      let asistentesObservable = this.afDB.list('/asistentes/' + evento.key);
      let eventosObservable = this.afDB.list('/eventos/' + evento.key);
      console.log(evento.nombre_fichero_imagen);
      firebase.storage().ref('img/' + this.authProv.UID + '/' + evento.nombre_fichero_imagen).delete()
        .then( (successOK)=> {
        asistentesObservable.remove()
            .then( (success) => {
              console.log(success);
              eventosObservable.remove()
                .then( (asistSuccess) => {
                      resolve(true);
                });
            });
        });
      });


    return promesa;
  }

  private mostrar_alerta(titulo:string, mensaje:string) {
    this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: ['OK']
    }).present();
  }

  private mostrar_toast(mensaje:string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();
  }

}

// Interfaz con la estructura de un objeto tipo archivoSubir
interface archivoSubir{
  $key?:string;
  img:string;
  titulo:string;
  descripcion: string;
  ubicacion: string;
  fecha: string;
  hora: string;
  num_max_asistentes: number;
  tipo_evento: string;
  publico: boolean;
  creador_evento: string;
  fecha_publicacion: string;
  nombre_fichero_imagen: string;
}
