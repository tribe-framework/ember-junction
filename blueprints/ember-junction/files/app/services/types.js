import Service from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Model, { attr } from '@ember-data/model';
import { getOwner } from '@ember/application';

export default class TypesService extends Service {
  @service store;
  @tracked json = this.store.peekRecord('webapp', 0, {
    include: ['total_objects'],
  });

  @action
  async fetchAgain() {
    if (ENV.TribeENV.API_URL !== undefined && ENV.TribeENV.API_URL != '') {
      this.json = await this.store.findRecord('webapp', 0, {});
      let owner = getOwner(this);

      Object.entries(this.json.modules).forEach(([modelName, modelData]) => {
        const modelDynamicName = modelName.replace(/_/g, '-');

        class DynamicModel extends Model {
          @attr slug;
          @attr modules;
        }

        if (!owner.hasRegistration(`model:${modelDynamicName}`)) {
          owner.register(`model:${modelDynamicName}`, DynamicModel);
        }
      });

      this.json = await this.store.findRecord('webapp', 0, {
        include: ['total_objects'],
      });
      this.json = this.json;
    }
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
