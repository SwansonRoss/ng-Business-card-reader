import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  firebaseService: FirebaseService;
  cards: Array<any>;
  value: any;
  authService: AuthService;
  foundCards: Array<any>;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private router: Router){
    this.firebaseService = new FirebaseService(db, auth, router);
    this.authService = new AuthService(db, auth, router);
  }

  ngOnInit() {
    this.firebaseService.getUsers()
      .subscribe(result => {
        this.value = result.data();
        console.log(result.data());
        this.cards = this.value.businessCards
        console.log(this.cards);
      });
  }

  searchByText(form: any){
    this.foundCards = [];
    console.log(form.searchCategory);
    console.log(form.searchText);
    if(form.searchCategory === "fName"){
      this.cards.forEach(card =>{
        if(card.firstName.includes(form.searchText)){
          console.log(`Found: ${card.firstName}`)
          this.foundCards.push(card);
        }
      })
    }
    if(form.searchCategory === "lName"){
      this.cards.forEach(card =>{
        if(card.lastName.includes(form.searchText)){
          console.log(`Found: ${card.lastName}`)
          this.foundCards.push(card);
        }
      })
    }
    if(form.searchCategory === "company"){
      this.cards.forEach(card =>{
        if(card.company.includes(form.searchText)){
          console.log(`Found: ${card.company}`)
          this.foundCards.push(card);
        }
      })
    }
  }

}
