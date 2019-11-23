import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'business-card-app';
  authService: AuthService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth){
    this.authService = new AuthService(db, auth);
  }


  ngOnInit(){}

  logout(): boolean {
    this.authService.logout();
    return false;
  }

}
