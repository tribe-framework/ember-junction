import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AuthRoute extends Route {
  @service auth;

  afterModel() {
    this.auth.checkIfLoggedIn();
  }
}
