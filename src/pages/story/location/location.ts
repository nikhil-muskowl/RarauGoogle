import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { AlertProvider } from '../../../providers/alert/alert';
import { DomSanitizer } from "@angular/platform-browser";
import { StoryCategoryPage } from '../story-category/story-category';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { ShowPhotoPage } from '../show-photo/show-photo';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})

export class LocationPage {
  @ViewChild("searchbar")
  public searchbar: ElementRef;

  map: any;
  GoogleAutocomplete: any;
  autocompleteItems: any = [];
  markers: any = [];
  autocomplete: any;
  geocoder: any;
  addressElement: HTMLInputElement = null;
  latitude: number = 0;
  longitude: number = 0;
  public selLatitude: number = 0;
  public selLongitude: number = 0;
  geo: any

  public locName;
  public image;
  public error;
  public story_srch_loc;
  public location_txt;
  public my_location_txt;
  public enter_value_serach;
  public next;


  //for css
  public myLocBtn;
  public isMycurrLoc;
  //for story_title
  story_title;
  public story_title_txt;
  public error_story_title;

  constructor(public navCtrl: NavController,
    public zone: NgZone,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public platform: Platform,
    public locationTrackerProvider: LocationTrackerProvider,
    public sanitizer: DomSanitizer,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {


    platform.registerBackButtonAction(() => {
      this.goBack();
    });

    //css for loc button
    this.isMycurrLoc = 0;
    this.myLocBtn = 'myLocBtn';

    this.setText();
    this.image = this.navParams.get('image');
    console.log('image on location page : ' + this.image);

    //uncommnet below for HK testing 
    this.latitude = this.locationTrackerProvider.getLatitude();
    this.longitude = this.locationTrackerProvider.getLongitude();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('error').subscribe((text: string) => {
      this.error = text;
    });
    this.translate.get('enter_value_serach').subscribe((text: string) => {
      this.enter_value_serach = text;
    });
    this.translate.get('location').subscribe((text: string) => {
      this.location_txt = text;
    });
    this.translate.get('next').subscribe((text: string) => {
      this.next = text;
    });
    this.translate.get('story_srch_loc').subscribe((text: string) => {
      this.story_srch_loc = text;
    });
    this.translate.get('my_location').subscribe((text: string) => {
      this.my_location_txt = text;
    });
    this.translate.get('enter_story_title').subscribe((text: string) => {
      this.story_title_txt = text;
    });
    this.translate.get('error_story_title').subscribe((text: string) => {
      this.error_story_title = text;
    });
  }

  MyLocation() {
    console.log("In my current location");
    if (this.isMycurrLoc == 0) {
      this.myLocBtn = 'myLocBtnclicked';
      this.isMycurrLoc = 1;
      this.story_title = '';
      this.selLatitude = this.latitude;
      this.selLongitude = this.longitude;
      console.log(" this.selLatitude : " + this.selLatitude);
    }
    else {
      this.myLocBtn = 'myLocBtn';
      this.isMycurrLoc = 0;
      this.selLatitude = 0;
      this.selLongitude = 0;
      console.log(" this.selLatitude : " + this.selLatitude);
    }
  }

  Next() {
    if (this.isMycurrLoc == 1) {
      if (this.story_title != '') {
        this.locName = this.story_title;
        this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.selLatitude, longitude: this.selLongitude });
      } else {
        this.alertProvider.title = this.error;
        this.alertProvider.message = this.error_story_title;
        this.alertProvider.showAlert();
      }
    }
    else {
      if (this.selLatitude == 0 && this.selLongitude == 0) {

        this.alertProvider.title = this.error;
        this.alertProvider.message = this.enter_value_serach;
        this.alertProvider.showAlert();
      } else {
        console.log('next category');
        console.log("this.locName : " + this.locName);

        this.navCtrl.push(StoryCategoryPage, { image: this.image, locName: this.locName, latitude: this.selLatitude, longitude: this.selLongitude });
      }
    }
  }

  goBack() {
    this.navCtrl.push(ShowPhotoPage, { photo: this.image });
  }

  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item) {
    console.log("You clicked on : " + JSON.stringify(item));
    // console.log('Search Lat', place.geometry.location.lat());
    //       console.log('Search Lng', place.geometry.location.lng());
    this.autocomplete.input = item.description;
    this.locName = item.description;
    console.log('locName : ' + this.locName);
    // this.clearMarkers();
    this.autocompleteItems = [];
    this.geo = item.description;
    this.geoCode(this.geo);
    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let position = {
          lat: results[0].geometry.location.lat,
          lng: results[0].geometry.location.lng
        };
        console.log('locations : ' + JSON.stringify(position));
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map,
        });
        // this.markers.push(marker);
        // this.map.setCenter(results[0].geometry.location);
      }
    })
  }

  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.selLatitude = results[0].geometry.location.lat();
      this.selLongitude = results[0].geometry.location.lng();
      console.log("lat: " + this.latitude + ", long: " + this.longitude);
    });
  }
}