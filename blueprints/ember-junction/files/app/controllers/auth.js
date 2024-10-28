import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class AuthController extends Controller {
  @service auth;

  @action
  clickSubmitButton(e) {
    document.querySelector('#auth-submit-password-btn').click();
  }
}
