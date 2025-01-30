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
  @service blueprints;

  @tracked inputPassword;
  @tracked isLoggedIn = false;
  @tracked junctionPassword = '';
  @tracked goToRouteAfterLogin = 'index';
  @tracked goToSlugAfterLogin = '';
  @tracked projectDescription = '';
  @tracked implementationSummary = '';
  @tracked blueprintLink = '';

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
  async logout() {
    await this.cookies.eraseCookie('junctionexpress_user_email');
    await this.cookies.eraseCookie('junctionexpress_user_id');
    await this.cookies.eraseCookie(ENV.JUNCTION_SLUG);
    window.location.href = 'https://junction.express';
  }

  @action
  async getJunctionPassword() {
    if (ENV.JUNCTION_SLUG == undefined || ENV.JUNCTION_SLUG == '') {
      alert('Please define JUNCTION_SLUG in .ENV file');
    } else if (ENV.JUNCTION_SLUG == 'junction') {
      this.junctionPassword = ENV.JUNCTION_PASSWORD;
    } else if (
      this.cookies.getCookie('junctionexpress_user_id') !== undefined
    ) {
      let user_id = this.cookies.getCookie('junctionexpress_user_id');
      await fetch('https://tribe.junction.express/custom/auth/access.php', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: ENV.JUNCTION_SLUG,
          user_id: user_id,
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (response) => {
          if (response !== undefined && response.authenticated === true) {
            this.cookies.setCookie(ENV.JUNCTION_SLUG, response.password);
            if (
              response.project_description !== undefined &&
              response.project_description != ''
            )
              this.projectDescription = response.project_description;
            if (
              response.blueprint_link !== undefined &&
              response.blueprint_link != ''
            )
              this.blueprintLink = response.blueprint_link;
            if (
              response.implementation_summary !== undefined &&
              response.implementation_summary != ''
            )
              this.implementationSummary = response.implementation_summary;
            this.type.loadingSearchResults = false;
            this.justGoToRouteAfterLogin();
          }
        });
    }
  }
}
