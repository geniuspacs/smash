import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { EventsProvider } from '../../providers/events/events';
import { AuthProvider } from '../../providers/auth/auth';
import { StorageProvider } from '../../providers/storage/storage';
import { LISTA_TIPOS_EVENTO } from '../../config/tipoEventos';

import { EventosClass } from '../../classes/eventos';

@Component({
  selector: 'page-subir-evento',
  templateUrl: 'subir-evento.html',
})
export class SubirEventoPage {

  imagen:string = "";
  imgPrev:string = "";
  fecha_actual:string = "";
  hora_actual:string = ""; 
  lista_tipos_evento: any = LISTA_TIPOS_EVENTO;

  fecha_seleccionada: string = "";
  hora_seleccionada: string = "";
  titulo: string = "";
  descripcion: string = "";
  ubicacion: string = "";
  tipo_evento: string = "";
  num_max_asistentes: number = 0;

  publico: boolean = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private eventsProv: EventsProvider, private storageProv: StorageProvider, private authProv: AuthProvider,
              private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

  }

  ionViewWillEnter() {
    this.imagen = this.navParams.get("imagen");
    this.imgPrev = 'data:image/jpeg;base64,' + this.navParams.get("imagen");

    setInterval( () => this.setHour(), 1000);

    this.fecha_actual = new Date().getFullYear().toString() + "-" + new Date().toLocaleDateString("us-US", {month: '2-digit'}) +
    "-" + new Date().toLocaleDateString("us-US", {day: '2-digit'});

  }

  private setHour() {

    if(new Date().getHours() <= 9) {
      this.hora_actual = "0" + new Date().getHours().toString();
    } else {
      this.hora_actual = new Date().getHours().toString();
    }

    if(new Date().getMinutes() <= 9) {
      this.hora_actual = this.hora_actual + ":0" + new Date().getMinutes().toString();
    } else {
      this.hora_actual = this.hora_actual + ":" + new Date().getMinutes().toString();
    }

  }

  subirEvento() {
    try {
      if(this.validar_fecha_hora() && this.validar_titulo() && this.validar_ubicacion() &&
          this.validar_tipo_evento() && this.validar_numero_max_asistentes()) {
        console.log("Subiendo fichero...")
        this.mostrar_toast("Subiendo fichero...");

        let archivoSubir: EventosClass = new EventosClass();
        archivoSubir.titulo = this.titulo;
        archivoSubir.descripcion = this.descripcion;
        archivoSubir.ubicacion = this.ubicacion;
        archivoSubir.fecha = this.fecha_seleccionada;
        archivoSubir.hora = this.hora_seleccionada;
        archivoSubir.num_max_asistentes = this.num_max_asistentes;
        archivoSubir.tipo_evento = this.tipo_evento;
        archivoSubir.img = this.imagen;
        archivoSubir.publico = this.publico;
        archivoSubir.creador_evento = this.storageProv.consultar_nombre_usuario();
        archivoSubir.fecha_publicacion = this.fecha_actual;

        console.log(JSON.stringify(archivoSubir));

        let loader = this.loadingCtrl.create({
          content: "Publicando tu evento..."
        });

        loader.present();

        console.log(archivoSubir.creador_evento);

        this.storageProv.subir_archivo(this.authProv.UID, archivoSubir).then( () => {
          loader.dismiss();
          this.cerrarModal();
        }, (error) => {
          loader.dismiss();
          this.mostrar_toast("Error: " + JSON.stringify(error));
          console.error("Error: ", JSON.stringify(error));
        }).catch( error => {
          loader.dismiss();
          this.mostrar_toast("Error: " + JSON.stringify(error));
          console.error("Error: ", JSON.stringify(error));
        });
      }
    } catch(e) {
        this.mostrar_toast(e);
        console.log(JSON.stringify(e));
    }
  }

  private validar_fecha_hora(): boolean {

    // Validamos que las fechas no sean vacías o nulas
    if(this.fecha_seleccionada !== undefined && this.fecha_seleccionada !== null &&
        this.fecha_seleccionada !== "" && this.hora_seleccionada !== undefined &&
        this.hora_seleccionada !== null && this.hora_seleccionada !== "") {

      /* Si la fecha seleccionada fuese la fecha de hoy, se deberá comprobar
         que la hora no es anterior a la actual. La hora se irá actualizando,
         dado que en el constructor la llamamos con un setInterval
      */
      if(this.fecha_actual === this.fecha_seleccionada) {

        /* Si la hora actual es posterior a la hora seleccionada (se ha seleccionado
            una hora a pasado), entonces no superará la validación
        */
        if(this.hora_actual > this.hora_seleccionada) {
          this.mostrar_alerta("Hora incorrecta", "Parece que la hora que has seleccionado ya ha pasado. Por favor, indica otra fecha.");
          return false;
        } else {
          return true;
        }

      } else {
        return true;
      }

    } else {
      // Fechas vacías o nulas
      this.mostrar_alerta("Fecha/Hora vacía", "Por favor, introduzca una fecha/Hora válida. Estos campos no pueden ser vacíos.");
      return false;
    }

  }

  private validar_titulo(): boolean {
    switch(this.titulo.trim()) {
      case "":
        this.mostrar_alerta("Titulo vacío", "Por favor, elige un título para tu evento. Este campo no puede ir vacío.");
        return false;
      default:
        return true;
    }
  }

  private validar_ubicacion(): boolean {
    switch(this.ubicacion.trim()) {
      case "":
        this.mostrar_alerta("Ubicación no definida", "Por favor, elige un lugar para celebrar tu evento. Este campo no puede ir vacío.");
        return false;
      default:
        return true;
    }
  }

  private validar_tipo_evento(): boolean {
    switch(this.tipo_evento.trim()) {
      case "":
        this.mostrar_alerta("Tipo de evento no definido", "Por favor, indica qué tipo de evento vas a realizar.");
        return false;
      default:
        return true;
    }
  }

  private validar_numero_max_asistentes(): boolean {
    if(this.num_max_asistentes.toString().trim() === "") {
        this.mostrar_alerta("Nª invitados vacío", "Por favor, indica el número máximo de personas que deseas que asistan a tu evento.");
        return false;
    } else if(this.num_max_asistentes <= 1) {
        this.mostrar_alerta("Nº invitados inválido", "El número de invitados no puede ser un número negativo o inferior a 1. Por favor, inserta un número válido");
        return false;
    } else {
        return true;
    }
  }

  private mostrar_alerta(titulo: string, mensaje: string) {
    this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: ['OK']
    }).present();
  }

  private mostrar_toast(mensaje:string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 9000
    }).present();
  }

  cerrarModal() {
    this.navCtrl.pop();
  }

}