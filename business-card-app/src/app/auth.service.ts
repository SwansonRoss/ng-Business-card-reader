import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseService: FirebaseService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private router: Router) { 
    this.firebaseService = new FirebaseService(db, auth, router);
  }

  login(user: string, password:string){
    
    if(this.firebaseService.SignIn(user, password)){
      return true;
    }

    return false;
  }

  logout(){

    console.log(localStorage.getItem('username'))
    localStorage.removeItem('username');
    console.log(localStorage.getItem('username'))
  }

  getUser(): any {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
]
