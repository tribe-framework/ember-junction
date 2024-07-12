import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service type;

  beforeModel() {
    this.type.currentType = null;
  }
}
