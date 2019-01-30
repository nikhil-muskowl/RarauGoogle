import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Loading, LoadingController, NavController, Platform, Modal, ModalController, ModalOptions, IonicPage, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchResultPage } from '../../SearchModule/search-result/search-result';
import { StoryListPage } from '../../story/story-list/story-list';
import { LocationTrackerProvider } from '../../../providers/location-tracker/location-tracker';
import { BaiduProvider } from '../../../providers/baidu/baidu';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { LoginProvider } from '../../../providers/login/login';
import { SearchPage } from '../../SearchModule/search/search';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { Slides } from 'ionic-angular';
import { OthersProfilePage } from '../../AccountModule/others-profile/others-profile';
import { EventListPage } from '../../Events/event-list/event-list';
import { NetworkProvider } from '../../../providers/network/network';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Slides) homeSlides: Slides;
  @ViewChild('map') mapRef: ElementRef;

  map: any;
  regionals: any = [];
  currentregional: any;

  //for css
  public myLocBtn;
  public isMycurrLoc;

  public images: Array<any>;
  public latLong;
  public zoomlatLong;
  public locations: any;
  public filterData: any;
  public responseData: any;
  public search = '';
  public latitude;
  public longitude;
  public data: any;

  public Advdata: any;
  public Advres;
  //youtube
  public trustedVideoUrl;
  loading: Loading;
  video: any = {
    url: 'https://www.youtube.com/embed/N4Onmbz3cDA',
    title: 'Udaipur (City of Lakes)'
  };

  searchForm: FormGroup;
  private formData: any;
  searchLocation;
  searchUser;
  public paramStryData;
  public paramData;
  public user_id;
  public language_id;
  public stories: any;
  public showStories: boolean = false;
  public markerHtml;

  public categories;
  public categoriesData;

  public searchCat;
  public searchUse;
  public serLatitude;
  public serLongitude;

  public rarau;
  public click_to_search;
  public sorry;
  public no_location;

  constructor(public navCtrl: NavController,
    public zone: NgZone,
    public platform: Platform,
    private view: ViewController,
    private modal: ModalController,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public formBuilder: FormBuilder,
    public locationTracker: LocationTrackerProvider,
    public loadingProvider: LoadingProvider,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider,
    public network: NetworkProvider,
    public loadingCtrl: LoadingController,
    private domSanitizer: DomSanitizer,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.showStories = false;
  }

  ngOnInit() {
    // Let's navigate from TabsPage to Page1
    this.locationTracker.setLocation();
    //css for loc button
    this.isMycurrLoc = 0;
    this.myLocBtn = 'myLocBtn';

    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();

    this.setText();

    //for youtube video
    this.trustedVideoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.video.url);
    // this.loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // this.loading.present();

    this.setMap();
  }

  setMap() {

    this.latitude = parseFloat(this.locationTracker.getLatitude());
    this.longitude = parseFloat(this.locationTracker.getLongitude());

    if (this.network.checkStatus() == true) {
      this.platform.ready().then(() => this.loadMaps());

      this.setCategory();

      this.getAdvertisement();
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  getCurrenLocation() {
    this.locationTracker.setLocation();

    if (this.isMycurrLoc == 0) {
      this.myLocBtn = 'myLocBtnclicked';
      this.isMycurrLoc = 1;
      this.setMap();
    }
    else {
      this.myLocBtn = 'myLocBtn';
      this.isMycurrLoc = 0;
      this.searchCat = undefined;
      this.searchUse = undefined;
      this.serLatitude = undefined;
      this.serLongitude = undefined;
    }
  }

  handleIFrameLoadEvent(): void {
    // this.loading.dismiss();
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('click_to_search').subscribe((text: string) => {
      this.click_to_search = text;
    });
    this.translate.get('sorry').subscribe((text: string) => {
      this.sorry = text;
    });
    this.translate.get('no_location').subscribe((text: string) => {
      this.no_location = text;
    });
  }

  setCategory() {

    this.loadingProvider.present();

    this.storyService.getCategory().subscribe(
      response => {
        this.categoriesData = response;
        console.log('Category : ' + JSON.stringify(response));

        this.categories = this.categoriesData.data;
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  gotoUsers(_id) {
    if (_id) {
      this.navCtrl.push(OthersProfilePage, { id: _id, user_id: this.user_id });
    }
  }

  openModal() {

    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      name: 'Nikhil Suwalka',
      occupation: 'Android Developer'
    };

    const myModal: Modal = this.modal.create(SearchPage, { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss((data) => {
      console.log("I have dismissed.");
      console.log('data from model : ' + JSON.stringify(data));

      if (data) {
        console.log('data.searchStoryUse : ' + data.searchUse);
        console.log('data.searchLoc : ' + data.searchLoc);
        console.log('data.searchCat : ' + data.searchCat);
        console.log('data.serLatitude : ' + data.latitude);
        console.log('data.serLongitude : ' + data.longitude);
        if (data.latitude != undefined)
          this.serLatitude = parseFloat(data.latitude);

        if (data.longitude != undefined)
          this.serLongitude = parseFloat(data.longitude);

        this.searchUse = data.searchUse;
        this.searchCat = data.searchCat;
        console.log('this.searchCat : ' + this.searchCat);
        if (data.searchCat == undefined && data.latitude == undefined && data.longitude == undefined && data.searchUse != undefined) {
          this.navCtrl.push(SearchResultPage, data);
        }
        else {
          this.getMarkers();
        }
      }
    });

    myModal.onWillDismiss((data) => {
      console.log("I'm about to dismiss");
      console.log(data);
    });
  }

  getAdvertisement() {
    this.language_id = this.languageProvider.getLanguageId();
    let param;

    param = {
      'language_id': this.language_id
    };

    this.storyService.apiGetAdvertisment(param)
      .subscribe(response => {

        this.Advres = response;
        this.Advdata = this.Advres.data;

        console.log('Advdata  : ' + JSON.stringify(this.Advres));

        this.loadingProvider.dismiss();
      },
        err => console.error(err),
        () => {
          this.loadingProvider.dismiss();
        }
      );
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == this.Advdata.length) {
      this.slides.stopAutoplay();
    }
  }

  loadMaps() {
    if (!!google) {
      this.getMarkers();
    }
  }

  getMarkers() {

    this.regionals = [];
    this.user_id = this.LoginProvider.isLogin();
    if (this.serLatitude != undefined && this.serLongitude != undefined) {
      this.latLong = {
        lat: parseFloat(this.serLatitude),
        lng: parseFloat(this.serLongitude)
      }
    }
    else {
      this.latLong = {
        lat: parseFloat(this.latitude),
        lng: parseFloat(this.longitude)
      }
    }

    if (this.serLatitude != undefined && this.serLongitude != undefined) {
      console.log('in params serLongitude : ' + this.serLatitude);
      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': parseFloat(this.serLatitude),
        'longitude': parseFloat(this.serLongitude)
      };
    }
    else if (this.searchCat != undefined) {
      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': parseFloat(this.latitude),
        'longitude': parseFloat(this.longitude)
      };
    }
    else {
      console.log('in params latitude : ' + this.latitude);

      this.paramStryData = {
        'user_id': this.user_id,
        'searchCat': this.searchCat,
        'searchUse': this.searchUse,
        'latitude': parseFloat(this.latitude),
        'longitude': parseFloat(this.longitude)
      };
    }

    console.log('bind map paramStryData : ' + JSON.stringify(this.paramStryData));
    this.storyService.apiTopStoryMarker(this.paramStryData).subscribe(
      response => {
        this.responseData = response;

        if (this.responseData.data.length > 0) {
          console.log('responseData.data : ' + JSON.stringify(this.responseData.data));
          this.responseData.data.forEach(element => {

            this.regionals.push({
              "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(element.latitude),
              "longitude": parseFloat(element.longitude),
            });

            //for zoom in last marker location
            // this.latLong = {
            //   lat: parseFloat(element.latitude),
            //   lng: parseFloat(element.longitude)
            // }
            console.log();
          });
          if (this.serLatitude != undefined && this.serLongitude != undefined) {
            this.regionals.push({
              // "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(this.serLatitude),
              "longitude": parseFloat(this.serLongitude),
            });
          }
          else {
            this.regionals.push({
              // "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(this.latitude),
              "longitude": parseFloat(this.longitude),
            });
          }
          //set in map
          this.initMap();
        }
        else {
          if (this.serLatitude != undefined && this.serLongitude != undefined) {
            this.regionals.push({
              // "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(this.serLatitude),
              "longitude": parseFloat(this.serLongitude),
            });
          }
          else {
            this.regionals.push({
              // "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(this.latitude),
              "longitude": parseFloat(this.longitude),
            });
          }

          //set in map
          this.initMap();

          this.alertProvider.title = this.sorry;
          this.alertProvider.message = this.no_location;
          this.alertProvider.showAlert();
        }
        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  homeSlidesNext() {
    this.homeSlides.slideNext();
  }

  homeSlidesPrev() {
    this.homeSlides.slidePrev();
  }

  initMap() {
    this.zone.run(() => {

      var mapEle = this.mapRef.nativeElement;

      this.map = new google.maps.Map(mapEle, {
        zoom: 17,
        center: this.latLong,
        // center: { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) },
        // mapTypeId: google.maps.MapTypeId.TERRAIN,
        // styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });

      // var controlMarkerUI = document.createElement('DIV');;
      // controlMarkerUI.style.cursor = 'pointer';
      // controlMarkerUI.style.backgroundImage = "url(assets/icon/Camera2.png)";
      // controlMarkerUI.style.height = '28px';
      // controlMarkerUI.style.width = '25px';
      // controlMarkerUI.style.top = '11px';
      // controlMarkerUI.style.left = '120px';
      // mapEle.appendChild(controlMarkerUI);
      // this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlMarkerUI);

      let markers = [];

      for (let regional of this.regionals) {
        regional.distance = 0;
        regional.visible = false;
        regional.current = false;

        var image = {
          url: regional.marker_thumb,
          // This marker is 32 pixels wide by 32 pixels high.
          size: new google.maps.Size(32, 32),
          // The origin for this image is (0, 0).
          // origin: new google.maps.Point(0, 0),
          scaledSize: new google.maps.Size(32, 32),
          // The anchor for this image is the base of the flagpole at (0, 32).
          // anchor: new google.maps.Point(0, 32)
        };

        let markerData = {
          position: {
            lat: parseFloat(regional.latitude),
            lng: parseFloat(regional.longitude)
          },
          map: this.map,
          icon: image,
          title: regional.title,
        };

        //put marker
        regional.marker = new google.maps.Marker(markerData);
        markers.push(regional.marker);

        regional.marker.addListener('click', () => {

          for (let c of this.regionals) {
            c.current = false;
            //c.infoWindow.close();
          }
          this.currentregional = regional;
          regional.current = true;

          console.log(regional.latitude);
          console.log(regional.longitude);

          this.showWindow(regional);
          //regional.infoWindow.open(this.map, regional.marker);
          this.map.panTo(regional.marker.getPosition());

        });
      }
    });
  }

  public resetStories() {
    this.showStories = false;
    this.stories = [];
  }

  closeList() {
    this.showStories = false;
    console.log("Click on close icon");
  }

  openEvents() {
    this.navCtrl.push(EventListPage);
  }

  public showWindow(markerData: any): void {

    this.user_id = this.LoginProvider.isLogin();
    this.paramData = {
      'user_id': this.user_id,
      'latitude': markerData.latitude,
      'longitude': markerData.longitude,
      'searchCat': this.searchCat,
      'searchUse': this.searchUse,
      'length': '3',
      'start': '0',
    };

    if (this.network.checkStatus() == true) {
      this.loadingProvider.show();
      this.storyService.apiTopStory(this.paramData).subscribe(
        response => {
          this.responseData = response;
          this.stories = this.responseData.data;
          if (this.stories.length > 0) {
            this.showStories = true;
          }
          this.loadingProvider.hide();
        },
        err => console.error(err),
        () => {
          this.loadingProvider.hide();
        }
      );
    }
    else {
      this.network.displayNetworkUpdate();
    }
  }

  goToList() {
    if (this.network.checkStatus() == true) {
      this.showStories = false;
      this.navCtrl.push(StoryListPage, this.paramData);
    } else {
      this.network.displayNetworkUpdate();
    }
  }
}