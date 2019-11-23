import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'business-card-app';
  authService: AuthService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth){
    this.authService = new AuthService(db, auth);
  }


  ngOnInit(){
    console.log(`Logged in: ${localStorage.getItem('username')}`);
  }

  ngOnDestroy(){
    this.authService.logout();
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }

}
