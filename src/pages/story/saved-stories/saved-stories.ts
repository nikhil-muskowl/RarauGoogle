import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { LoginProvider } from '../../../providers/login/login';
import { LoadingProvider } from '../../../providers/loading/loading';
import { AlertProvider } from '../../../providers/alert/alert';
import { StoryServiceProvider } from '../../../providers/story-service/story-service';
import { SingleStoryPage } from '../single-story/single-story';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-saved-stories',
  templateUrl: 'saved-stories.html',
})
export class SavedStoriesPage {

  public user_id;
  public paramData;
  public responseData;
  public data;

  public pageStart = 0;
  public pageLength = 5;
  public recordsTotal;
  public records;
  public filterData;
  public model: any[] = [];

  public saved_story;
  public rarau;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertProvider: AlertProvider,
    public platform: Platform,
    public network: NetworkProvider,
    public storyService: StoryServiceProvider,
    public loadingProvider: LoadingProvider,
    public LoginProvider: LoginProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider, ) {

    this.platform.registerBackButtonAction(() => {
      this.goBack();
    });

    this.setText();
    this.isLogin();
    if (this.network.checkStatus() == true) {
      this.getSavedStories();
    }
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('saved_story').subscribe((text: string) => {
      this.saved_story = text;
    });
    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
  }

  //checking logged in user
  isLogin() {
    this.user_id = this.LoginProvider.isLogin();
  }

  //goto previous page
  goBack() {
    this.navCtrl.pop();
  }

  //load saved stories of user from server
  getSavedStories() {

    this.loadingProvider.present();

    this.paramData = {
      'save_story_id': this.user_id,
    };

    this.storyService.getSavedStories(this.paramData).subscribe(
      response => {

        this.records = response;
        this.recordsTotal = this.records.recordsTotal;
        this.data = this.records.data;
        this.binddata();

        this.loadingProvider.dismiss();
      },
      err => console.error(err),
      () => {
        this.loadingProvider.dismiss();
      }
    );
  }

  //bind server data OnScroll
  binddata() {
    for (let index = 0; index < this.data.length; index++) {
      this.model.push({
        id: this.data[index].id,
        user_id: this.data[index].user_id,
        user_name: this.data[index].user_name,
        image_thumb: this.data[index].image_thumb,
        image: this.data[index].image,
        tags: this.data[index].tags,
        categories: this.data[index].categories,
        latitude: this.data[index].latitude,
        longitude: this.data[index].longitude,
        totalLikes: this.data[index].totalLikes,
        totalDislikes: this.data[index].totalDislikes,
        totalFlames: this.data[index].totalFlames,
        date: this.data[index].date,
        status: this.data[index].status,
      });
    }
  }

  //load more on Scroll Down 
  onScrollDown(infiniteScroll) {
    if (this.pageStart <= this.recordsTotal) {
      this.pageStart += this.pageLength;
      this.getSavedStories();
    }

    infiniteScroll.complete();
  }

  //goto story detail page
  gotoStoryDetail(data) {
    this.navCtrl.push(SingleStoryPage, { story_id: data.id });
  }
}
