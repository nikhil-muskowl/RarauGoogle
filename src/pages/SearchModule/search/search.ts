import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';
import { SearchResProvider } from '../../../providers/search-res/search-res';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { NetworkProvider } from '../../../providers/network/network';
declare var google: any;

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild("searchbar")

  geo: any;
  public searchbar: ElementRef;
  map: any;
  GoogleAutocomplete: any;
  autocompleteItems: any = [];
  markers: any = [];
  autocomplete: any;
  geocoder: any;
  addressElement: HTMLInputElement = null;

  searchForm: FormGroup;
  private formData: any;
  searchUser;
  public categories: any;
  public categoriesData: any;
  public locations: any;
  public fileterData: any;
  public filterData: any;
  public responseData: any;
  public searchData: any;
  public searchResponse: any;
  public searchLoc;
  public searchUse;
  public searchCat;
  public locName;
  public latitude;
  public longitude;
  public searcLatitude;
  public searcLongitude;
  public paramData;
  public user_id;

  public story_srch_user;
  public story_srch_loc;
  public search_text;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public zone: NgZone,
    public network: NetworkProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
    private view: ViewController,
    public formBuilder: FormBuilder,
    public locationTrackerProvider: LocationTrackerProvider,
    public searchProvider: SearchResProvider,
    public translate: TranslateService,
    public locationTracker: LocationTrackerProvider,
    public languageProvider: LanguageProvider, ) {

    this.setText();
    // this.createForm();

    this.locationTracker.setLocation();
    this.latitude = this.locationTracker.getLatitude();
    this.longitude = this.locationTracker.getLongitude();
    // this.latitude = '39.919981';
    // this.longitude = '116.414977';

    if (this.network.checkStatus() == true) {
      this.getCategory();
    }
    else {
      this.network.displayNetworkUpdate();
    }

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.geocoder = new google.maps.Geocoder;
    this.markers = [];

    console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
    console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('story_srch_user').subscribe((text: string) => {
      this.story_srch_user = text;
    });
    this.translate.get('story_srch_loc').subscribe((text: string) => {
      this.story_srch_loc = text;
    });
    this.translate.get('search').subscribe((text: string) => {
      this.search_text = text;
    });
  }

  //get category from server
  getCategory() {

    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.responseData = response;
        console.log('Category : ' + JSON.stringify(response));

        this.categories = this.responseData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  //create form and validation
  createForm() {
    this.searchForm = this.formBuilder.group({
      searchUser: ['', Validators.required],
    });
  }

  //close modal and redirect to calling page
  closeModal() {
    const data = {
      // search: this.searchUser
    };
    this.view.dismiss();
  }

  //global search for all methods
  globalSearch() {
    console.log('searchUsercat : ' + this.searchCat);
    console.log('searchUse : ' + this.searchUse);
    console.log('searchLoc : ' + this.searchLoc);
    console.log('latitude : ' + this.searcLatitude);
    console.log('longitude : ' + this.searcLongitude);

    if (this.searchCat != undefined || this.searchUse != undefined || this.searchLoc != undefined || this.searcLatitude != undefined || this.searcLongitude != undefined) {
      const data = {
        searchCat: this.searchCat,
        searchUse: this.searchUse,
        searchLoc: this.searchLoc,
        latitude: this.searcLatitude,
        longitude: this.searcLongitude
      };
      this.view.dismiss(data);
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search story category
  searchUsercat() {
    console.log('searchUsercat : ' + this.searchCat);

    if (this.searchCat != undefined) {
      const data = {
        searchCat: this.searchCat
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search user story
  searchUserStory() {
    console.log('searchUse : ' + this.searchUse);

    if (this.searchUse != undefined) {

      const data = {
        searchUse: this.searchUse,
      };
      this.view.dismiss(data);

    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //search user
  searchUsers(event) {
    event.stopPropagation();
    this.searchUser = this.searchForm.value.searchUser;
    console.log('searchUser: ' + this.searchUser);

    if (this.searchForm.value.searchUser != '') {
      const data = {
        searchUsers: this.searchUser,
      };
      this.view.dismiss(data);
    }
    else {
      this.alertProvider.title = 'Error';
      this.alertProvider.message = 'Please Enter value to search.';
      this.alertProvider.showAlert();
    }
  }

  //get user from server
  public getUsers() {

    this.filterData = {
      search: this.searchUse,
      start: 0,
      length: 10
    };

    this.searchProvider.apiSearchRes(this.filterData).subscribe(
      response => {
        console.log(response);
        this.searchResponse = response;
        this.searchData = this.searchResponse.data;
      },
      err => { console.error(err); }
    );
    console.log(this.locations);
  }

  //search item select
  public searchItemSelected(searches: any) {
    console.log(searches);
    if (searches) {
      this.searchUse = searches.name;
    }

    this.searchData = [];
  }

  //get user from server no input search
  public onUserInput(ev: any) {
    this.searchUse = ev.target.value;
    this.searchData = [];
    this.getUsers();
  }

  //on user search cancel
  public onUserCancel(ev: any) {
    this.searchUse = '';
  }

  //search location update
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

  //on select location result item from search
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
    this.searchLoc = item.description;
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

  //convert into geo code and name
  geoCode(address: any) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': address }, (results, status) => {
      this.searcLatitude = results[0].geometry.location.lat();
      this.searcLongitude = results[0].geometry.location.lng();
      console.log("lat: " + this.latitude + ", long: " + this.longitude);
    });
  }

  //on location cancel
  public onLocCancel(ev: any) {
    this.searchLoc = '';
  }

}
