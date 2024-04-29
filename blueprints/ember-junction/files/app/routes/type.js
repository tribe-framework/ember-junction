import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class TypeRoute extends Route {
  @service types;

  async model(params) {
    return await this.types.json.modules[params.slug];
  }
}
