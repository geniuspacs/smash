import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ActionSheetController, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { SubirEventoPage } from '../subir-evento/subir-evento';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';

import { PushProvider } from '../../providers/push/push';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root = HomePage;
  subirPage = SubirEventoPage;
  // tab2Root = SolicitudesPage;

  img:string ="";
  imgPreview:string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, 
    private actionSheetCtrl: ActionSheetController, private camera: Camera, private imgPicker: ImagePicker, 
    private toastCtrl: ToastController, private pushProv: PushProvider) {
  }

  opcionesSubidaEvento() {
    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Camara',
          handler: () => {
            this.abrir_camara();
          }
        },
        {
          text: 'Galería',
          handler: () => {
            this.abrir_galeria();
          }
        }
      ]
    }).present();
  }

  abrir_camara() {

    const cameraOptions: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(cameraOptions).then( (imagePath) => {
      this.img = imagePath;

      let modal = this.modalCtrl.create(this.subirPage, {imagen: this.img});
      modal.present();
    }, (error) => {
      this.mostrar_toast("Error en el proceso: " + error);
    });
  }

  abrir_galeria() {
    let opciones: ImagePickerOptions = {
      maximumImagesCount: 1,
      quality: 40,
      outputType: 1
    };

    this.imgPicker.getPictures(opciones).then( (imgPath)=> {
      this.img = imgPath[0];
      let modal = this.modalCtrl.create(this.subirPage, {imagen: this.img});
      modal.present();
    }, (error) => {
      this.mostrar_toast("Error en el proceso: " + error);
    });
  }

  private mostrar_toast(mensaje:string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 2500
    }).present();
  }

}
