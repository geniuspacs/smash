import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { DatosUsuarioPage } from '../pages/datos-usuario/datos-usuario';
import { SubirEventoPage } from '../pages/subir-evento/subir-evento';
import { TabsPage } from '../pages/tabs/tabs';

// Providers
import { QuerysDatabaseProvider } from '../providers/querys-database/querys-database';

import { HttpModule } from '@angular/http';

// Firebase
import { Firebase } from '@ionic-native/firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FCM } from '@ionic-native/fcm';

// Camera
import { Camera } from '@ionic-native/camera';

// Img Picker
import { ImagePicker } from '@ionic-native/image-picker';

import { firebaseConfig } from '../config/firebaseConfig';
import { UserProvider } from '../providers/user/user';
import { PushProvider } from '../providers/push/push';
import { AuthProvider } from '../providers/auth/auth';
import { StorageProvider } from '../providers/storage/storage';
import { EventsProvider } from '../providers/events/events';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DatosUsuarioPage,
    SubirEventoPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    HttpModule,
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DatosUsuarioPage,
    SubirEventoPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    HttpModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QuerysDatabaseProvider,
    UserProvider,
    FCM,
    Camera,
    ImagePicker,
    PushProvider,
    AuthProvider,
    StorageProvider,
    EventsProvider
  ]
})
export class AppModule {}
