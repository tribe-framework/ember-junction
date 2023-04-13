import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class AuthController extends Controller {
  @service auth;
}
