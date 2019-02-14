import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { LoginProvider } from '../../../providers/login/login';

@IonicPage()
@Component({
  selector: 'page-alert-modal',
  templateUrl: 'alert-modal.html',
})
export class AlertModalPage {

  public paramData;
  public user_id;
  public welcome_txt;
  public image;
  public logged_txt;

  public keep_going;
  public from;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingProvider: LoadingProvider,
    private view: ViewController,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    public LoginProvider: LoginProvider,
  ) {
    this.setText();
    this.getData();
  }

  //data from pages
  getData() {
    let data = this.navParams.get('data');
    // console.log('modal data :  ' + JSON.stringify(data));
    this.welcome_txt = data.welcome;
    this.image = data.image;
    this.logged_txt = data.logged;
    this.from = data.from;
  }

  //setting text according to language
  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('keep_going').subscribe((text: string) => {
      this.keep_going = text;
    });
  }

  //open a page on modal click
  openPage() {
    const data = {
      close: 1
    };
    this.view.dismiss(data);
  }

  //close modal
  closeModal() {
    const data = {
      close: 0
    };
    this.view.dismiss(data);
  }
}