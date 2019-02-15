import { Injectable } from '@angular/core';


@Injectable()
export class ConfigProvider {


  static BASE_URL: string = 'http://rarau.hk/';
  // static BASE_URL: string = 'http://social-app.muskowl.com/';
  // static BASE_URL: string = 'http://172.16.8.87/codeigniter/social_app/';

  constructor() {

  }

  //set tutorial seen value in storage
  public setisSeen(data) {
    console.log('setData when isSeen : ' + JSON.stringify(data));
    try {
      window.localStorage.setItem('isSeen', data);
    } catch (error) {

    }
  }

  //unset tutorial seen value in storage
  public unSetData() {
    try {
      window.localStorage.removeItem('isSeen');
    } catch (error) {
    }
  }

  //get tutorial seen value from storage
  public isSeen() {
    try {
      return window.localStorage.getItem('isSeen');
    } catch (error) {
      return false;
    }
  }
}
