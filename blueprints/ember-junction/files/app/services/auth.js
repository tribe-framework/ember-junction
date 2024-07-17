import Service from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class AuthService extends Service {
  @service router;
  @service cookies;
  @tracked inputPassword;
  @tracked isLoggedIn = false;
  @tracked junctionPassword = '';

  checkIfLoggedIn = () => {
    let cookiePassword = this.cookies.getCookie(ENV.JUNCTION_SLUG);

    if (
      cookiePassword !== '' &&
      this.junctionPassword !== '' &&
      cookiePassword == this.junctionPassword
    ) {
      return true;
    } else if (
      cookiePassword !== null &&
      ENV.JUNCTION_SLUG !== undefined &&
      ENV.JUNCTION_SLUG != '' &&
      this.junctionPassword == ''
    ) {
      this.inputPassword = cookiePassword;
      this.submitPassword();
    } else {
      return false;
    }
  };

  @action
  async submitPassword() {
    if (
      ENV.JUNCTION_SLUG == 'junction' &&
      this.inputPassword !== '' &&
      this.junctionPassword !== '' &&
      this.inputPassword == this.junctionPassword
    ) {
      this.cookies.setCookie(ENV.JUNCTION_SLUG, this.inputPassword);
      this.router.transitionTo('index');
    } else if (ENV.JUNCTION_SLUG !== undefined && ENV.JUNCTION_SLUG != '') {
      await fetch('https://tribe.junction.express/custom/auth/access.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: ENV.JUNCTION_SLUG,
          password: this.inputPassword,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (response) => {
          if (response.authenticated === true) {
            this.cookies.setCookie(ENV.JUNCTION_SLUG, this.inputPassword);
            this.router.transitionTo('index');
          } else {
            alert('Incorrect password.');
          }
        });
    }
  }

  @action
  logout() {
    this.cookies.eraseCookie(ENV.JUNCTION_SLUG);
    window.location.reload(true);
  }

  @action
  getJunctionPassword() {
    if (ENV.JUNCTION_SLUG == undefined || ENV.JUNCTION_SLUG == '') {
      alert('Please define JUNCTION_SLUG in .ENV file');
    } else if (ENV.JUNCTION_SLUG == 'junction') {
      this.junctionPassword = ENV.JUNCTION_PASSWORD;
    }
  }
}
