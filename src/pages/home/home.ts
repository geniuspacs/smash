import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QuerysDatabaseProvider } from '../../providers/querys-database/querys-database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  hayMas: boolean = true;

  constructor(public navCtrl: NavController, private qdbProv: QuerysDatabaseProvider) {
    
  }

  refrescarListaEventos(refresher) {
    this.hayMas = true;
    this.qdbProv.cargar_eventos()
        .then((success) => {
          refresher.complete();
        })
  }

  cargar_siguientes(infiniteScroll) {
    this.qdbProv.cargar_siguientes_eventos()
        .then((existenMas: boolean) => {
          
          infiniteScroll.complete();
          this.hayMas = existenMas;
          
        });
  }

  ionViewDidLoad(){
    this.qdbProv.cargar_eventos()
    .then((success)=>{
      
    });
  }

}
