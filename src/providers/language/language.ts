import { HttpClient, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigProvider } from '../config/config';

@Injectable()
export class LanguageProvider {
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();
  public responseData: any;
  private URL;

  public language;
  public language_id;

  constructor(public http: HttpClient) {
    this.language = 'english';
    this.language_id = 1;

    this.language = this.getLanguage();
    this.language_id = this.getLanguageId();
  }

  //get language from serve
  public getLanguages() {
    this.formData = new FormData();
    this.URL = ConfigProvider.BASE_URL + 'settings/api/languages_api';
    return this.http.post(this.URL,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //set language id and code to storage
  public setLanguage(data) {
    try {
      window.localStorage.setItem('language_id', data.id);
      window.localStorage.setItem('language', data.code);
    } catch (error) {
    }
  }

  //get language from storage
  public getLanguage() {
    try {
      if (window.localStorage.getItem('language')) {
        return window.localStorage.getItem('language');
      } else {
        return 'english';
      }

    } catch (error) {
      return 'english';
    }
  }

  //set language to storage
  public setLanguageId(data) {
    try {
      window.localStorage.setItem('language_id', data.id);
    } catch (error) {
    }
  }

  //get language Id from storage
  public getLanguageId() {
    try {
      if (window.localStorage.getItem('language_id')) {
        return window.localStorage.getItem('language_id');
      } else {
        return '1';
      }
    } catch (error) {
      return '1';
    }
  }

}