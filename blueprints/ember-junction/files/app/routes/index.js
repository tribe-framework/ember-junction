import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IndexRoute extends Route {
  @service store;

  async model() {
    return await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
  }
}
