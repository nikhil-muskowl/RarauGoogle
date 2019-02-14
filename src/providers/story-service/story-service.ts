import { HttpClient, HttpRequest, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingProvider } from '../../providers/loading/loading';
import { AlertProvider } from '../../providers/alert/alert';
import { ToastProvider } from '../../providers/toast/toast';
import { ConfigProvider } from '../config/config';

@Injectable()
export class StoryServiceProvider {
  feeds;
  public headers = new HttpHeaders();
  public formData: FormData = new FormData();

  constructor(
    public loadingProvider: LoadingProvider,
    public alertProvider: AlertProvider,
    public toastProvider: ToastProvider,
    public http: HttpClient,
    public ConfigProvider: ConfigProvider,
  ) {

    this.headers.set('Access-Control-Allow-Origin', '*');
    this.headers.set('Content-Type', 'application/json; charset=utf-8');
    this.feeds = [];
  }

  //api to get all categories
  getCategory() {
    this.formData = new FormData();
    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/story_types_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api get top story marker of that location
  apiTopStoryMarker(data: any) {
    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);

    if (data.searchUse != undefined) {
      this.formData.append('user_name', data.searchUse);
    }
    if (data.latitude != undefined) {
      this.formData.append('latitude', data.latitude);

    }
    if (data.longitude != undefined) {
      this.formData.append('longitude', data.longitude);
    }
    if (data.searchCat != undefined) {
      this.formData.append('story_types', JSON.stringify(data.searchCat));

    }
    this.formData.append('distance', '10');


    console.log(this.formData);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/top_stories_marker',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api get top stories list of that location marker
  apiTopStory(data: any) {

    this.formData = new FormData();

    if (data.user_id)
      this.formData.append('user_id', data.user_id);

    if (data.latitude) {
      this.formData.append('latitude', data.latitude);
    }
    if (data.searchUse != undefined) {
      this.formData.append('user_name', data.searchUse);
    }
    if (data.latitude) {
      this.formData.append('longitude', data.longitude);
    }
    if (data.length) {
      this.formData.append('length', data.length);
    }
    if (data.start) {
      this.formData.append('start', data.start);
    }
    if (data.searchCat) {
      this.formData.append('story_types', JSON.stringify(data.searchCat));
    }

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/top_stories',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //post story on server
  postStory(data: any) {

    var tags = data.tags;
    var images = data.images;
    var user_id = data.user_id;
    var locName = data.locName;
    var catId = data.catId;
    var latitude = data.latitude;
    var longitude = data.longitude;
    var receipt_private = data.receipt_private;
    var receipt = data.receipt;
    var language_id = data.language_id;
    var event_id = data.event_id;

    console.log('images : ' + JSON.stringify(images));
    this.formData = new FormData();
    this.formData.append('language_id', language_id);
    this.formData.append('title', locName);
    this.formData.append('description', '');
    this.formData.append('receipt_private', receipt_private);
    this.formData.append('receipt', receipt);
    this.formData.append('tags', JSON.stringify(tags));
    this.formData.append('latitude', latitude);
    this.formData.append('longitude', longitude);
    this.formData.append('images', JSON.stringify(images));
    this.formData.append('user_id', user_id);
    this.formData.append('types', JSON.stringify(catId));
    if (event_id != undefined || event_id != '')
      this.formData.append('event_id', event_id);
    else
      this.formData.append('event_id', '0');

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/api_save',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get story of user
  getStory(data) {

    this.formData = new FormData();
    this.formData.append('user_id', data.user_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get comment of story
  apiGetComments(data) {

    this.formData = new FormData();
    this.formData.append('story_id', data.story_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/story_comments_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get saved stories
  getSavedStories(data) {

    this.formData = new FormData();
    this.formData.append('save_story_id', data.save_story_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get advert
  apiGetAdvertisment(data) {

    this.formData = new FormData();
    this.formData.append('language_id', data.language_id);

    return this.http.post(ConfigProvider.BASE_URL + 'advertisement_module/api/advertisements_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get story details
  getStoryDetail(data) {

    this.formData = new FormData();
    var story_id = data.story_id;
    console.log('story_id : ', story_id);
    console.log('language_id : ', data.language_id);
    this.formData.append('language_id', data.language_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/detail/' + story_id,
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //do comment on story
  setComment(data: any) {
    this.formData = new FormData();

    console.log('param comment : ' + JSON.stringify(data));
    this.formData.append('user_id', data.user_id);
    this.formData.append('story_id', data.story_id);
    this.formData.append('comment', data.comment);
    this.formData.append('language_id', data.language_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/story_comments_api/save',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //rank story
  rankStory(data) {

    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);
    this.formData.append('story_id', data.story_id);
    this.formData.append('likes', String(data.likes));
    this.formData.append('dislikes', String(data.dislikes));

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/set_ranking',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //save other users stories in Saved Story
  saveStory(data) {

    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);
    this.formData.append('story_id', data.story_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/set_save_stories',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get saved stories
  showSavedStory(data) {

    this.formData = new FormData();

    this.formData.append('save_story_id', data.user_id);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get ranked stories of user itself
  getRankedStory(data) {
    this.formData = new FormData();

    if (data.user_id != undefined)
      this.formData.append('user_id', data.user_id);

    this.formData.append('story_type_id', data.story_type_id);
    this.formData.append('length', data.length);
    this.formData.append('start', data.start);
    this.formData.append('language_id', data.language_id);
    this.formData.append('order[0][column]', '3');
    this.formData.append('order[0][dir]', 'desc');

    if (data.location != undefined)
      this.formData.append('location', data.location);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //get profile story ranks
  getProfileStoriesRank(data) {
    this.formData = new FormData();

    if (data.user_id != undefined)
      this.formData.append('user_id', data.user_id);

    this.formData.append('story_type_id', data.story_type_id);
    this.formData.append('length', data.length);
    this.formData.append('start', data.start);
    this.formData.append('language_id', data.language_id);
    this.formData.append('order[0][column]', '3');
    this.formData.append('order[0][dir]', 'desc');

    if (data.location != undefined)
      this.formData.append('location', data.location);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api comment complain
  apicommentComplain(data) {
    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);
    this.formData.append('language_id', data.language_id);
    this.formData.append('story_comment_id', data.story_comment_id);
    this.formData.append('story_id', data.story_id);
    this.formData.append('title', data.title);
    this.formData.append('description', data.description);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/story_complains_api/save',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api story complain
  apiStoryComplain(data) {
    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);
    this.formData.append('language_id', data.language_id);
    this.formData.append('story_id', data.story_id);
    this.formData.append('title', data.title);
    this.formData.append('description', data.description);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/story_complains_api/save',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api user complain
  apiUserComplain(data) {
    this.formData = new FormData();

    this.formData.append('user_id', data.user_id);
    this.formData.append('language_id', data.language_id);
    this.formData.append('complain_by', data.complain_by);
    this.formData.append('title', data.title);
    this.formData.append('description', data.description);

    return this.http.post(ConfigProvider.BASE_URL + 'user_module/api/user_complains_api/save',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }

  //api all locaiton
  apiGetAllLocations(data) {
    this.formData = new FormData();
    this.formData.append('location', data);

    return this.http.post(ConfigProvider.BASE_URL + 'story_module/api/stories_api/allLocations',
      this.formData,
      {
        headers: this.headers,
      }
    );
  }
}
