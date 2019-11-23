import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  firebaseService: FirebaseService;
  items: Array<any>;
  value: any;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth){
    this.firebaseService = new FirebaseService(db, auth);
  }

  ngOnInit() {
    this.firebaseService.getUsers()
      .subscribe(result => {
        this.value = result.data();
        console.log(result.data());
        console.log(this.value);
      })
  }

  addNewCard(form: any){

    console.log(`val: ${this.value}`)
    var user = this.value;
    user.businessCards.forEach(x => {console.log(x)});
    user.businessCards.push({
          firstName: form.firstName,
          lastName: form.lastName,
          company: form.company,
          email: form.email,
          phone: form.phone,
          additionalInfo: form.comments
    })
    this.firebaseService.addBusinessCard(user);
    user.businessCards.forEach(x => {console.log(x)});
    return false;
  }

}
