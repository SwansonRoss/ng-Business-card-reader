import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParseImageService {
  url: string;
  image: string;

  cardPromise: Promise<string>;
  cardContent: any;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;

  constructor(private http: HttpClient ) {
    this.url = `https://vision.googleapis.com/v1/images:annotate?key=${environment.cloudVision}`;
  }

  public parseForText(image: string){
    this.cardPromise = this.getText(image);
    this.cardContent = this.cardPromise.then(value => {
      return value;
    })
    console.log(`Card Content: ${this.cardContent}`);
  }

  async getText(image: string): Promise<string>{
    this.http.post(this.url, {
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
    }).subscribe(value => {
      try{
        var resp: Array<any> 
        resp = value.responses;

        resp.forEach( x => {
          return (x.textAnnotations[0].description)
        })
      } catch{
        console.log("does not exist")
      }
    })

    return null;
  }

}
