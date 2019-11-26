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


    return this.getText(image)
      .subscribe(value => this.cardContent = value.responses[0].textAnnotations[0].description);


  }

  getText(image: string): Observable<any> {
    return this.http.post<any>(this.url, {
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
