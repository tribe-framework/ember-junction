import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class FooterComponent extends Component {
  @tracked yearNow = new Date().getFullYear();

  get hidePostcodeAttribution() {
    if (ENV.HIDE_POSTCODE_ATTRIBUTION !== undefined)
      return ENV.HIDE_POSTCODE_ATTRIBUTION;
    else return false;
  }
}
