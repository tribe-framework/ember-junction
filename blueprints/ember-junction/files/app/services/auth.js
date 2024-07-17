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

  checkIfLoggedIn = ()=>{
    let cookiePassword = this.cookies.getCookie(ENV.JUNCTION_SLUG);

    if (cookiePassword !== "" && this.junctionPassword !== "" && (cookiePassword == this.junctionPassword)) {
      return true;
    } else {
      return false;
    }
  }

  @action
  submitPassword() {
    if (this.inputPassword !== "" && this.junctionPassword !== "" && (this.inputPassword == this.junctionPassword)) {
      this.cookies.setCookie(ENV.JUNCTION_SLUG, this.inputPassword);
      this.router.transitionTo('index');
    } else {
      alert('Incorrect password.');
    }
  }

  @action
  logout() {
    this.cookies.eraseCookie(ENV.JUNCTION_SLUG);
    window.location.reload(true);
  }

  @action
  async getJunctionPassword() {

    if (ENV.JUNCTION_SLUG == undefined || ENV.JUNCTION_SLUG == '') {

      alert('Please define JUNCTION_SLUG in .ENV file');

    } else {

      let junctionSlug = ENV.JUNCTION_SLUG;

      if (junctionSlug != 'junction') {

        await fetch(
          'https://tribe.junction.express/custom/auth/access.php?slug='+junctionSlug,
            {
              method: 'post',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                slug: junctionSlug,
                password: this.inputPassword,
              }),
            },
        )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then(async (response) => {
          if (response.junction_password !== undefined && response.junction_password != '') {
            this.junctionPassword = response.junction_password;
          } else if (ENV.JUNCTION_PASSWORD !== undefined && ENV.JUNCTION_PASSWORD != '') {
            this.junctionPassword = ENV.JUNCTION_PASSWORD;
          }
        });

      } else {

        this.junctionPassword = ENV.JUNCTION_PASSWORD;

      }

    }
  }

}
