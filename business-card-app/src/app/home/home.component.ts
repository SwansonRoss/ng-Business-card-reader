import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

import { AuthService } from '../auth.service';

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

  constructor(public db: AngularFirestore, private auth: AngularFireAuth){
    this.firebaseService = new FirebaseService(db, auth);
    this.authService = new AuthService(db, auth);
  }

  ngOnInit(){
    this.firebaseService.getUsers()
      .subscribe(result => {
        // console.log(result.forEach(x => {
        //   console.log(x.payload.doc.id);
        // }));
        // this.items = result;
        this.value = result.data();
        console.log(result.data())
      })
      /*
1CKIrNj6SPbrpVgdo0yR
EEcpATLXtKV5Gu51nLCb
FoKr4mOrlMScTbFtgdMf
QYovDLvIlRktDInY0DEA


this.tasks.pipe(map(actions => {
        return actions.map(a => {
          //Get document data
          const data = a.payload.doc.data() as Task;

          //Get document id
          const id = a.payload.doc.id;

          //Use spread operator to add the id to the document data
          return { id, ...data };
        });
      }));
      */
  }

}