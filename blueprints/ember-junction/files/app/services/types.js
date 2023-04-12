import Service from '@ember/service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesService extends Service {
  @service store;
  @tracked json = this.store.peekRecord('webapp', 0, {
    include: ['total_objects'],
  });

  @action
  async fetchAgain() {
    this.json = await this.store.findRecord('webapp', 0, {
      include: ['total_objects'],
    });
    this.json = this.json;
  }
}
