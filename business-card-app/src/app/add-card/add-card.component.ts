import { Component, OnInit } from '@angular/core';

//Libraries for firebase
import { FirebaseService } from '../firebase.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";

// Libraries for webcam
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {WebcamImage, WebcamInitError, WebcamUtil} from 'ngx-webcam';
import { importType } from '@angular/compiler/src/output/output_ast';

// Cloudvision library
import { ParseImageService } from '../parse-image.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.css']
})
export class AddCardComponent implements OnInit {

  firebaseService: FirebaseService;
  parseImageService: ParseImageService;
  items: Array<any>;
  value: any;

  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // latest snapshot
  public webcamImage: WebcamImage = null;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean|string> = new Subject<boolean|string>();

  //Cloud vision object

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private http: HttpClient ){
    this.firebaseService = new FirebaseService(db, auth);
    this.parseImageService = new ParseImageService(http);
  }

  ngOnInit() {
    this.firebaseService.getUsers()
      .subscribe(result => {
        this.value = result.data();
        console.log(result.data());
        console.log(this.value);
      });

    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
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

  public triggerSnapshot(): void {
    console.log("Snapshot triggered");
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;

    const urlImage = webcamImage.imageAsDataUrl

    console.log(urlImage)

    const parsedImage = urlImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');

    console.log(parsedImage);

    

    const payload: any = {
      'requests': [
        {
          'image': {
            'content' : urlImage.substring(23, urlImage.length)
          },
          'features': [
            {
              'type': 'TEXT_DETECTION',
              'maxResults': 1
            }
          ]
        }
      ]
    }

    this.parseImageService.parseForText(parsedImage);

    

    
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


}
