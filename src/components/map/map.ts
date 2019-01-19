import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { BaiduProvider } from '../../providers/baidu/baidu';
import { NavController, Platform, ViewController } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { StoryListPage } from '../../pages/story/story-list/story-list';
import { AlertProvider } from '../../providers/alert/alert';
import { StoryServiceProvider } from '../../providers/story-service/story-service';
import { LoadingProvider } from '../../providers/loading/loading';
import { LoginProvider } from '../../providers/login/login';
import { LanguageProvider } from '../../providers/language/language';
import { TranslateService } from '@ngx-translate/core';

declare var google: any;

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapComponent {
  @ViewChild('map') mapRef: ElementRef;

  public latitude;
  public longitude;
  map: any;
  regionals: any = [];
  currentregional: any;
  public images: Array<any>;
  public latLong;
  public zoomlatLong;
  public locations: any;
  public filterData: any;
  public responseData: any;
  public search = '';
  public data: any;
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

  //txt
  public sorry;
  public no_location;

  constructor(public navCtrl: NavController,
    public zone: NgZone,
    public platform: Platform,
    private view: ViewController,
    public alertProvider: AlertProvider,
    public locationTrackerProvider: LocationTrackerProvider,
    public baiduProvider: BaiduProvider,
    public locationTracker: LocationTrackerProvider,
    public loadingProvider: LoadingProvider,
    public languageProvider: LanguageProvider,
    public translate: TranslateService,
    public storyService: StoryServiceProvider,
    public LoginProvider: LoginProvider, ) {
    console.log('Hello MapComponent Component');

  }

  ngOnInit() {
    // Let's navigate from TabsPage to Page1
    this.locationTracker.setLocation();

    this.platform.ready().then(() => this.loadMaps());
    this.user_id = this.LoginProvider.isLogin();
    this.language_id = this.languageProvider.getLanguageId();

    console.log('this.locationTracker.getLatitude : ' + this.locationTracker.getLatitude());
    console.log('this.locationTracker.getLongitude : ' + this.locationTracker.getLongitude());
    this.latitude = parseFloat(this.locationTracker.getLatitude());
    this.longitude = parseFloat(this.locationTracker.getLongitude());

    console.log('after this.locationTracker.getLatitude : ' + this.latitude);
    console.log('after this.locationTracker.getLongitude : ' + this.longitude);
  }


  loadMaps() {
    if (!!google) {
      this.getMarkers();
    }
  }

  getMarkers() {
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

          }
          else {
            this.regionals.push({
              // "marker_thumb": element.marker_thumb,
              "latitude": parseFloat(this.latitude),
              "longitude": parseFloat(this.longitude),
            });
          }
          this.initMap();
        }
        else {
          this.regionals.push({
            // "marker_thumb": element.marker_thumb,
            "latitude": parseFloat(this.latitude),
            "longitude": parseFloat(this.longitude),
          });
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

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('sorry').subscribe((text: string) => {
      this.sorry = text;
    });
    this.translate.get('no_location').subscribe((text: string) => {
      this.no_location = text;
    });
  }

  initMap() {

    this.zone.run(() => {
      var mapEle = this.mapRef.nativeElement;

      this.map = new google.maps.Map(mapEle, {
        zoom: 17,
        center: this.latLong,
        // center: { lat: parseFloat(this.latitude), lng: parseFloat(this.longitude) },
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      });

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
    this.loadingProvider.hide();
  }

  goToList() {
    this.showStories = false;
    this.navCtrl.push(StoryListPage, this.paramData);
  }
}
