import Service from '@ember/service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesService extends Service {
  @service store;
  @tracked json = this.store.peekRecord('webapp', 0, {});

  @action
  async fetchAgain() {
    this.json = await this.store.findRecord('webapp', 0, {});
    this.json = this.json;
  }

  @action
  async saveCurrentTypes(t) {
    let d = new Date().toLocaleString();
    let obj = this.store.createRecord('deleted_record', {
      modules: {
        title: 'Last used on ' + d,
        is_types: true,
        deleted_type: 'blueprint_record',
        types_json: t,
        content_privacy: 'public',
      },
    });
    await obj.save();

    obj.modules.deleted_slug = obj.slug;
    await obj.save();
  }
}
