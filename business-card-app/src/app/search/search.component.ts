import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { AuthService } from '../auth.service';

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

  constructor(public db: AngularFirestore, private auth: AngularFireAuth){
    this.firebaseService = new FirebaseService(db, auth);
    this.authService = new AuthService(db, auth);
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
    console.log(form.searchCategory);
    console.log(form.searchText);
    if(form.searchCategory === "fName"){
      this.cards.forEach(card =>{
        if(card.firstName.includes(form.searchText)){
          console.log(`Found: ${card.firstName}`)
        }
      })
    }
    if(form.searchCategory === "lName"){
      this.cards.forEach(card =>{
        if(card.lastName.includes(form.searchText)){
          console.log(`Found: ${card.lastName}`)
        }
      })
    }
    if(form.searchCategory === "company"){
      this.cards.forEach(card =>{
        if(card.company.includes(form.searchText)){
          console.log(`Found: ${card.company}`)
        }
      })
    }
  }

}
