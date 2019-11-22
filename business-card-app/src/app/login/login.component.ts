import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  authService: AuthService;
  message: string;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth) { 
    this.authService = new AuthService(db, auth);
    this.message = '';
  }

  ngOnInit() {
  }

  onSubmit(form: any): boolean {
    this.message = '';
    if (! this.authService.login(form.emailAddress, form.password)){
        this.message = 'Incorrect credentials.';
        setTimeout(function() {
          this.message = '';
        }.bind(this), 2500);
    }
    return false;
  }

  logout(): boolean {
    this.authService.logout();
    return false;
  }

  //this.firebaseService.createUser(form);
  //Email: Ross.a.swanson@gmail.com
  //pw: testtesttest

}
