import Controller from '@ember/controller';
import { service } from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class IndexController extends Controller {
  @service types;

  get plausibleAuth() {
    return ENV.PLAUSIBLE_AUTH;
  }

  get plausibleURL() {
    return ENV.PLAUSIBLE_URL;
  }
}
