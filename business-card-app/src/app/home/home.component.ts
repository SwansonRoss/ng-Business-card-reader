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
  editHidden: boolean;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private router: Router){
    this.firebaseService = new FirebaseService(db, auth, router);
    this.authService = new AuthService(db, auth, router);
  }

  ngOnInit(){
    this.firebaseService.getUsers()
      .subscribe(result => {
        this.value = result.data();
        console.log(result.data())
        this.items = this.value.businessCards
      })

    this.editHidden = false;
   
  }

  editCard(form: any, email: string){
    this.deleteCard(email);
    console.log(`form.fName`)
    this.value.businessCards.push({
          firstName: form.firstName,
          lastName: form.lastName,
          company: form.company,
          email: form.email,
          phone: form.phone,
          additionalInfo: form.comments
    })
    this.firebaseService.addBusinessCard(this.value);
    return false;
  }

  deleteCard(email: string){
    this.value.businessCards.forEach(card =>{
      if(card.email.includes(email)){
        var deleteIndex = this.value.businessCards.indexOf(card);
        this.value.businessCards.splice(deleteIndex, 1);
      }
    })
    this.firebaseService.addBusinessCard(this.value);
    return false;
  }

  showForm(i: string){
    console.log(this.editHidden)
    this.editHidden = !this.editHidden;
  }

}
