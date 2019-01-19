import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Modal, ModalController, ModalOptions, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationPage } from '../registration/registration';
import { ProfilePage } from '../../MainModule/profile/profile';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { LoginWechatPage } from '../login-wechat/login-wechat';

//provider
import { LoginProvider } from '../../../providers/login/login';
import { AlertProvider } from '../../../providers/alert/alert';
import { LoadingProvider } from '../../../providers/loading/loading';
import { TranslateService } from '@ngx-translate/core';
import { LanguageProvider } from '../../../providers/language/language';
import { TabsService } from "../../util/tabservice";
import { AlertModalPage } from '../alert-modal/alert-modal';
import { NotiProvider } from '../../../providers/noti/noti';
import { NetworkProvider } from '../../../providers/network/network';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  submitAttempt;
  loginForm: FormGroup;
  private formData: any;
  private status;
  private message;
  private responseData;
  private responseDbData;
  private error_email;
  private error_password;
  private success;
  public token;
  public type;

  private failed;
  private success_msg;
  private error_warning;
  private rarau;
  private login;
  private forgot_pass;
  private let_go;
  private new_to_rarau;
  private connect_and_go;
  private login_wechat;
  private sign_up;
  private or;
  private welcome;
  private logged_in;
  private email_password_incorrect;
  private reg_mail;
  private pass_text;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loginProvider: LoginProvider,
    public alertProvider: AlertProvider,
    public loadingProvider: LoadingProvider,
    private tabService: TabsService,
    private platform: Platform,
    public network: NetworkProvider,
    public notiProvider: NotiProvider,
    public translate: TranslateService,
    public languageProvider: LanguageProvider,
    private modal: ModalController,
  ) {
    this.tabService.show();

    this.setText();

    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])],
      password: ['', Validators.required]
    });

    this.token = this.notiProvider.getToken();
    console.log('andorid device token : ' + this.token);
    if (this.platform.is('ios')) {
      this.type = 'ios';
    }
    if (this.platform.is('android')) {
      this.type = 'android';
    }

    if (this.loginProvider.user_id) {
      this.navCtrl.setRoot(ProfilePage);
    }
  }

  setText() {
    this.translate.setDefaultLang(this.languageProvider.getLanguage());
    this.translate.use(this.languageProvider.getLanguage());

    this.translate.get('login').subscribe((text: string) => {
      this.login = text;
    });
    this.translate.get('sign_up').subscribe((text: string) => {
      this.sign_up = text;
    });
    this.translate.get('login_wechat').subscribe((text: string) => {
      this.login_wechat = text;
    });

    this.translate.get('rarau').subscribe((text: string) => {
      this.rarau = text;
    });
    this.translate.get('or').subscribe((text: string) => {
      this.or = text;
    });
    this.translate.get('forgot_pass').subscribe((text: string) => {
      this.forgot_pass = text;
    });
    this.translate.get('let_go').subscribe((text: string) => {
      this.let_go = text;
    });
    this.translate.get('new_to_rarau').subscribe((text: string) => {
      this.new_to_rarau = text;
    });
    this.translate.get('connect_and_go').subscribe((text: string) => {
      this.connect_and_go = text;
    });
    this.translate.get('error_password').subscribe((text: string) => {
      this.error_password = text;
    });
    this.translate.get('error_email').subscribe((text: string) => {
      this.error_email = text;
    });
    this.translate.get('success').subscribe((text: string) => {
      this.success = text;
    });
    this.translate.get('failed').subscribe((text: string) => {
      this.failed = text;
    });
    this.translate.get('email_password_incorrect').subscribe((text: string) => {
      this.email_password_incorrect = text;
    });
    this.translate.get('welcome').subscribe((text: string) => {
      this.welcome = text;
    });
    this.translate.get('logged_in').subscribe((text: string) => {
      this.logged_in = text;
    });
    this.translate.get('reg_mail').subscribe((text: string) => {
      this.reg_mail = text;
    });
    this.translate.get('fpass').subscribe((text: string) => {
      this.pass_text = text;
    });
  }

  ionViewDidLoad() {
    this.tabService.show();
    console.log('ionViewDidLoad LoginPage');
  }

  goToRegsiter() {
    this.navCtrl.push(RegistrationPage);
  }

  save() {
    if (this.network.checkStatus() == true) {
      this.submitAttempt = true;
      this.formData = this.loginForm.valid;

      if (this.loginForm.valid) {

        this.loadingProvider.present();
        this.loginProvider.apiLogin(this.loginForm.value).subscribe(
          response => {

            this.responseData = response;
            console.log(response);

            if (this.responseData.status == true && this.responseData.message != '') {
              /* this.success_msg = this.responseData.message;
               this.alertProvider.title = this.success;
               this.alertProvider.message = this.success_msg;
               this.alertProvider.showAlert();
               this.loginForm.reset();
               this.submitAttempt = false;*/
              this.loginProvider.setData(this.responseData.result);

              //register device to FCM
              let data = {
                user_id: this.responseData.result.id,
                type: this.type,
                code: this.token,
                provider: 'firebase'
              }
              this.notiProvider.apiRegisterDevice(data).subscribe(
                notiResponse => {

                  console.log("Noti response" + JSON.stringify(notiResponse));
                });

              //open modal
              this.openModal();

              // this.navCtrl.setRoot(ProfilePage);//on modal dismiss
            }
            else if (this.responseData.status == false) {
              this.alertProvider.title = this.failed;
              this.alertProvider.message = this.email_password_incorrect;
              this.alertProvider.showAlert();
            }
          },
          err => console.error(err),
          () => {
            this.loadingProvider.dismiss();
          }
        );
      }
    }
  }

  openModal() {
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };

    const myModalData = {
      welcome: this.welcome,
      image: 'assets/imgs/story/pos-flam.png',
      logged: this.logged_in,
      from: 1
    };

    const myModal: Modal = this.modal.create(AlertModalPage, { data: myModalData }, myModalOptions);

    myModal.present();

    myModal.onDidDismiss(() => {
      this.loginForm.reset();
      this.submitAttempt = false;
      this.navCtrl.setRoot(ProfilePage);
    });

    myModal.onWillDismiss(() => {
      this.navCtrl.setRoot(ProfilePage);
    });
  }

  forgotPass() {
    this.navCtrl.push(ForgotPasswordPage);
  }

  goToWechat() {
    this.navCtrl.push(LoginWechatPage);
  }
}
