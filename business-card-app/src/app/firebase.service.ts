import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(public db: AngularFirestore, private angularFireAuth: AngularFireAuth) {
   }

  createUser(value: any){
    return this.db.collection('BusinessCards').doc(value.emailAddress).set({
      username: value.emailAddress,
      businessCards: [
        {
          firstName: "John",
          lastName: "Test",
          company: "TestCo Inc.",
          email: "abc@def.xyz",
          phone: "(123) 456-7890",
          additionalInfo: ""
        }
      ]
    })
  }

  SignIn(email: string, password: string): boolean {
    this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(res => {
        console.log('Successfully signed in!');
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
    return this.db.collection('BusinessCards').doc('1CKIrNj6SPbrpVgdo0yR').get(); //TODO: find away to get id
    }

  addBusinessCard(id, value){
    this.db.collection('BusinessCards').doc(id).set(value);
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
