import Service from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class AuthService extends Service {
	@service router;
	@tracked inputPassword;
	@tracked isLoggedIn = false;

	@action
	checkPassword() {
	    if (this.inputPassword == ENV.JUNCTION_PASSWORD) {
        this.login();
        this.router.transitionTo('index');
	    } else {
	      alert('Incorrect password.');
	    }
	}

	@action
	checkIfLoggedIn() {
    if (this.getCookie('junction_logged_in') == ENV.JUNCTION_PASSWORD) {
      this.login();
      return true;
    } else {
      return false;
    }
  }

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
	login() {
		this.isLoggedIn = true;
		var expires = '';
		var date = new Date();
		date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
		expires = '; expires=' + date.toUTCString();
		document.cookie = 'junction_logged_in=' + ENV.JUNCTION_PASSWORD + expires + '; path=/';
	}

	@action
	logout() {
	    var expires = '';
        var date = new Date();
        date.setTime(date.getTime() + (-1) * 24 * 60 * 60 * 1000);
        expires = '; expires=' + date.toUTCString();
	    document.cookie = 'junction_logged_in=' + ENV.JUNCTION_PASSWORD + expires + '; path=/';
	    this.router.transitionTo('auth');
	}
}
