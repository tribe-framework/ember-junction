import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class CookiesService extends Service {
  @tracked days = 365;

  @action
  setCookie(name, value) {
    var expires = '';

    var date = new Date();
    date.setTime(date.getTime() + this.days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();

    if (ENV.environment == 'development') {
      document.cookie = name + '=' + (value || '') + expires + '; path=/';
    } else {
      document.cookie =
        name +
        '=' +
        (value || '') +
        expires +
        '; path=/; domain=.junction.express';
    }
  }

  @action
  getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  @action
  eraseCookie(name) {
    if (ENV.environment == 'development') {
      document.cookie =
        name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    } else {
      document.cookie =
        name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie =
        name +
        '=; Path=/; domain=.junction.express; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}
