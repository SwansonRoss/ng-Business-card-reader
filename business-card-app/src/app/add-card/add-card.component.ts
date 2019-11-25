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
import { FormGroup, FormBuilder } from '@angular/forms';

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
  cardContent: Array<string>;

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

  //regex
  phone: RegExp = new RegExp(/^\+?1?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/);
  private email = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})/)
  private name = new RegExp(/^(([D][r][\.])|([M][r][\.])|([M][s][\.]))? ?[A-Za-z]+ [A-Za-z]?\.? ?[A-Za-z]+[-]?[A-Za-z?]+,? ?[A-Za-z?]{1,2}\.?[A-Za-z?]{1}\.?/)
  private postfixCompany = new RegExp(/^\w+,? (Co|co|Inc|inc|llc|LLC|Partners|partners).?/)

  //scanned card parts
  parsedFName: string;
  parsedLName: string;
  parsedCompany: string;
  parsedEmail: string;
  parsedPhone: string; 

  cardForm: FormGroup;

  constructor(public db: AngularFirestore, private auth: AngularFireAuth, private http: HttpClient, fb: FormBuilder ){
    this.firebaseService = new FirebaseService(db, auth);
    this.parseImageService = new ParseImageService(http);
    this.cardForm = fb.group({
      'fName': [''],
      'lName':[''],
      'company':[''],
      'phone':[''],
      'email':[''],
      'comments':['']
    });
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

    console.log(`val: ${form}`)
    var user = this.value;
    user.businessCards.forEach(x => {console.log(x)});
    user.businessCards.push({
          firstName: form.fName,
          lastName: form.lName,
          company: form.company,
          email: form.email,
          phone: form.phone,
          additionalInfo: form.comments
    })
    this.firebaseService.addBusinessCard(user);
    user.businessCards.forEach(x => {console.log(x)});
    return false;
  }

  public onSubmit(value: string): void {
    console.log('You submitted value: ', value)
  }

  public triggerSnapshot(): void {
    console.log("Snapshot triggered");
    this.clearParsedStrings();
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

    const parsedImage = urlImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');


    //console.log(`parsed: ${this.parseImageService.parseForText(parsedImage)}`); 
    this.parseImageService.getText(parsedImage).subscribe(value => {
      this.cardContent = (value.responses[0].textAnnotations[0].description).split('\n');
      this.cardContent.forEach((content) => {
        if(this.email.test(content) && this.parsedEmail == ""){
          console.log(`email: ${content}`)
          this.parsedEmail = content;
          this.cardForm.patchValue({email : this.parsedEmail})

        } else if(this.phone.test(content) && this.parsedPhone == "") {
          console.log(`phone: ${content}`)
          this.parsedPhone = content;
          this.cardForm.patchValue({phone : this.parsedPhone})

        }else if(this.postfixCompany.test(content) && this.parsedCompany == "") {
          console.log(`company: ${content}`)
          this.parsedCompany = content;
          this.cardForm.patchValue({company : this.parsedCompany})
          
        }else if(this.name.test(content) && this.parsedLName == ""){
        console.log(`name: ${content}`)
        var nameArray = content.split(' ');
        this.parsedLName = nameArray[nameArray.length - 1]
        this.cardForm.patchValue({lName : this.parsedLName})

        var fNameArray = nameArray.slice(0, nameArray.length - 1)
        var firstName = "";
        fNameArray.forEach(x =>{firstName += (x + " ") })
        this.parsedFName = firstName;
        this.cardForm.patchValue({fName : this.parsedFName})
        }

        
      })
    }); 

    
  }

  public clearParsedStrings(){
    this.parsedFName = "";
    this.parsedLName = "";
    this.parsedEmail = "";
    this.parsedPhone = "";
    this.parsedCompany = "";
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


}
