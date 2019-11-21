import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  firebaseService: FirebaseService;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth) { 
    this.firebaseService = new FirebaseService(db, auth);
  }

  ngOnInit() {
  }

  onSubmit(form: any): void {
    console.log('you submitted value:', form.emailAddress);
    //this.firebaseService.createUser(form);
    this.firebaseService.SignIn(form.emailAddress, form.password);
  }
  //Email: Ross.a.swanson@gmail.com
  //pw: testtesttest

}
