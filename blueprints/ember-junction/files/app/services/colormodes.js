import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class ColormodesService extends Service {
  @service cookies;

  @tracked mode = this.cookies.getCookie('junction_color_mode') ?? 'dark';

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

  @tracked innerHTML = 'Save changes';

  @action
  buttonLoading(e) {
    e.target.disabled = true;
    this.innerHTML = e.target.innerHTML;
    e.target.innerHTML =
      '<div class="small spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>';
  }

  @action
  buttonUnloading(e) {
    e.target.innerHTML = this.innerHTML;
    e.target.disabled = false;
  }
}
