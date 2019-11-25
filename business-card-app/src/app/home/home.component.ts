import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  firebaseService: FirebaseService;
  items: Array<any>;
  value: any;
  authService: AuthService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private router: Router){
    this.firebaseService = new FirebaseService(db, auth, router);
    this.authService = new AuthService(db, auth, router);
  }

  ngOnInit(){
    this.firebaseService.getUsers()
      .subscribe(result => {
        this.value = result.data();
        console.log(result.data())
      })
   
  }

}
