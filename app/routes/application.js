import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service store;

  async model() {
    //findRecord for type+slug pair and findAll all objects in a type
    return await this.store.findRecord('types_json', 'webapp');

    //this.store.findAll('film');
    //this.store.query('film', {page: {limit: 2, offset: 0}});
  }
}
