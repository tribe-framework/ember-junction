import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ColormodesService extends Service {
  @service cookies;

  @tracked mode = this.cookies.getCookie('junction_color_mode');

  @action
  changeMode() {
    if (this.mode == 'light') {
      this.mode = 'dark';
    } else {
      this.mode = 'light';
    }

    this.cookies.setCookie('junction_color_mode', this.mode);
    document.querySelector('html').dataset.bsTheme = this.mode;
  }

  @action
  initMode() {
    document.querySelector('html').dataset.bsTheme = this.mode;
  }

  get inverseModeExtreme() {
    if (this.mode == 'light') {
      return 'black';
    } else {
      return 'white';
    }
  }

  get modeExtreme() {
    if (this.mode == 'light') {
      return 'white';
    } else {
      return 'black';
    }
  }

  get inverseMode() {
    if (this.mode == 'light') {
      return 'dark';
    } else {
      return 'light';
    }
  }
}
