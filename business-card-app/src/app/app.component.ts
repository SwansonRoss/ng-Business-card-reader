import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'business-card-app';
  authService: AuthService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private router: Router){
    this.authService = new AuthService(db, auth, router);
  }


  ngOnInit(){
    console.log(`Logged in: ${localStorage.getItem('username')}`);
    console.log(this.router.url);
    if((localStorage.getItem('username') == null) && (this.router.url !== '/login')){
      this.router.navigate(['login'])
      console.log(this.router.url)
    }
  }

  ngOnDestroy(){
    this.authService.logout(); 
  }

  logout(): boolean {
    this.authService.logout();
    this.router.navigate(['login']);
    return false;
  }

}
