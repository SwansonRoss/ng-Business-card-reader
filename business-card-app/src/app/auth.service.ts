import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  firebaseService: FirebaseService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth) { 
    this.firebaseService = new FirebaseService(db, auth);
  }

  login(user: string, password:string){
    
    if(this.firebaseService.SignIn(user, password)){
      localStorage.setItem('username', user);
      return true;
    }

    return false;
  }

  logout(){
    localStorage.removeItem('username');
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
