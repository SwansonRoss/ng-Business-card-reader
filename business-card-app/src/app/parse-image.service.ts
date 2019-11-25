import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParseImageService {
  url: string;
  image: string;

  cardPromise: Observable<any>;
  cardObserver: Observer<any>;
  cardContent: any;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;

  constructor(private http: HttpClient ) {
    this.url = `https://vision.googleapis.com/v1/images:annotate?key=${environment.cloudVision}`;
  }

  public async parseForText(image: string){
    // var observer = {
    //   next: function(value){
    //     console.log(`next: ${value}`);
    //     this.cardContent = value.responses[0].textAnnotations[0].description
    //     console.log(this.cardContent)
    //     return this.cardContent;
    //   },
    //   error: function(value){
    //     console.log(`error: ${value}`);
    //   },
    //   complete: function(value){
    //     console.log(`completed: ${value}`);
    //   }
    // }

    return this.getText(image)
      .subscribe(value => this.cardContent = value.responses[0].textAnnotations[0].description);


      // console.log(value.responses[0].textAnnotations[0].description);
      //   return value.responses[0].textAnnotations[0].description;

    // this.cardPromise
    //   .subscribe(value => {
    //   try{
    //     var resp: Array<any> 
    //     resp = value.responses;

    //     resp.forEach( x => {
    //       this.cardContent = x.textAnnotations[0].description.toString();
    //     })
    //   } catch{
    //     console.log("does not exist")
    //   }

    //   console.log(this.cardContent);
    // });

  }

  getText(image: string): Observable<string> {
    return this.http.post<string>(this.url, {
        'requests': [
          {
            'image': {
              'content' : image
            },
            'features': [
              {
                'type': 'TEXT_DETECTION',
                'maxResults': 1
              }
            ]
          }
        ]
      })
    }

}
