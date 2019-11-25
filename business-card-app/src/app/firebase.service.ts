import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(public db: AngularFirestore, private angularFireAuth: AngularFireAuth, private router:Router) {
   }

  createUser(){
    return this.db.collection('BusinessCards').doc(localStorage.getItem('username')).set({
      username: localStorage.getItem('username'),
      businessCards: []
    })
  }

  SignIn(email: string, password: string): boolean {
    this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed in!');
        localStorage.setItem('username', email);
        console.log(`logged in: expected: ${email}; actual: ${localStorage.getItem('username')}`)
        this.router.navigate(['home']);
        return true;
      })
      .catch(err => {
        console.log('Something is wrong:',err.message);
        return false;
      });

      return false;
  }

  getUsers(){
    //return  this.db.collection('BusinessCards').snapshotChanges()
    return this.db.collection('BusinessCards').doc(localStorage.getItem('username')).get(); //TODO: find away to get id
  }

  userExists(){
    this.getUsers()
      .subscribe( result => {
        try{
          console.log(result.data().payload);
          return true;
        }
        catch{
          this.createUser();
          return false;
        }
      })
  }

  /**
   this.firebaseService.getUsers()
      .subscribe(result => {
        // console.log(result.forEach(x => {
        //   console.log(x.payload.doc.id);
        // }));
        // this.items = result;
        this.value = result.data();
        console.log(result.data())
      })
   */

  addBusinessCard(value){
    this.db.collection('BusinessCards').doc(localStorage.getItem('username')).set(value);
  }

    /*
return Observable.create(resolve => {
        this.storage.ready().then(() => {

            this.storage.get('authData').then(authData => {
              let hdr = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' +
                authData.access_token });

                console.log('access_token ' + authData.access_token);
              let opt = new RequestOptions({ headers: hdr });
                 return this.http.get(AppSettings.API_GET_CITIES,opt).map(res => <CityModel[]> res.json()).subscribe((result) => {
                  console.log(result);
                  resolve = result;
                });
            }).catch(() => {
              //resolve(false);
            });

        });

    });
    */

   deleteUser(userKey){
    return this.db.collection('users').doc(userKey).delete();
  }
  
}
