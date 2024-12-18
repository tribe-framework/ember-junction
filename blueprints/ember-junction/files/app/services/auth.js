import Service from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class AuthService extends Service {
  @service router;
  @service cookies;
  @service type;
  @service types;

  @tracked inputPassword;
  @tracked isLoggedIn = false;
  @tracked junctionPassword = '';
  @tracked goToRouteAfterLogin = 'index';
  @tracked goToSlugAfterLogin = '';

  checkIfLoggedIn = async () => {
    this.type.loadingSearchResults = true;
    let cookiePassword = this.cookies.getCookie(ENV.JUNCTION_SLUG);

    if (
      cookiePassword !== '' &&
      this.junctionPassword !== '' &&
      cookiePassword == this.junctionPassword
    ) {
      this.type.loadingSearchResults = false;
      return true;
    } else if (
      cookiePassword !== null &&
      ENV.JUNCTION_SLUG &&
      this.junctionPassword == ''
    ) {
      this.inputPassword = cookiePassword;
      await this.submitPassword();
      this.type.loadingSearchResults = false;
      return true;
    } else {
      this.type.loadingSearchResults = false;
      return false;
    }
  };

  @action
  async submitPassword() {
    this.type.loadingSearchResults = true;
    if (
      ENV.JUNCTION_SLUG == 'junction' &&
      this.inputPassword !== '' &&
      this.junctionPassword !== '' &&
      this.inputPassword == this.junctionPassword
    ) {
      this.cookies.setCookie(ENV.JUNCTION_SLUG, this.inputPassword);
      this.type.loadingSearchResults = false;
      this.justGoToRouteAfterLogin();
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
          if (response !== undefined && response.authenticated === true) {
            this.types.json.modules.webapp.name = response.title;
            await this.types.json.save();
            this.cookies.setCookie(ENV.JUNCTION_SLUG, this.inputPassword);
            this.type.loadingSearchResults = false;
            this.justGoToRouteAfterLogin();
          } else {
            this.type.loadingSearchResults = false;
            alert('Incorrect password.');
          }
        });
    }
  }

  @action
  async justGoToRouteAfterLogin() {
    if (
      this.goToRouteAfterLogin == 'index' ||
      this.goToRouteAfterLogin == 'auth'
    )
      this.router.transitionTo('index');
    else {
      this.type.currentType = this.types.json.modules[this.goToSlugAfterLogin];
      this.router.transitionTo(
        this.goToRouteAfterLogin,
        this.goToSlugAfterLogin,
      );
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
