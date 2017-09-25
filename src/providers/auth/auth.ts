import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import * as firebase from 'firebase/app';

@Injectable()
export class AuthProvider {

  constructor(public http: Http) {
    
  }

  // Autenticacion de usuario por email/password
  verifica_usuario(email:string, password:string): firebase.Promise<any> {
    
    return firebase.auth().signInWithEmailAndPassword(email, password);

  }

  // Autenticacion de usuario por cuenta de Gmail
  verifica_usuario_google() {
    var providerGoogle = new firebase.auth.GoogleAuthProvider();

    return firebase.auth().signInWithRedirect(providerGoogle);

  }

  // Autenticacion de usuario por cuenta de Facebook
  verifica_usuario_facebook() {
    var providerFacebook = new firebase.auth.FacebookAuthProvider();

    return firebase.auth().signInWithRedirect(providerFacebook);
  }

  // Autenticacion de usuario por cuenta de Twitter
  verifica_usuario_twitter() {
    var providerTwitter = new firebase.auth.TwitterAuthProvider();

    return firebase.auth().signInWithRedirect(providerTwitter);
  }

  // SignOut
  signOut() {
    firebase.auth().signOut();
  }

  displayName(): string {
    return firebase.auth().currentUser.displayName;
  }

  get UID(): string {
    return firebase.auth().currentUser.uid;
  }

}
