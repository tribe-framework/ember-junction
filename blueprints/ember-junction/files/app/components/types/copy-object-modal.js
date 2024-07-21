import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesCopyObjectModalComponent extends Component {
  @service store;
  @service types;
  @service type;
  @service object;

  @action
  async pushObject() {
    const vvv = this.object.currentObject.modules;
    delete vvv.id;
    delete vvv.slug;

    let obj = await this.store.createRecord(this.type.currentType.slug, {
      modules: { ...vvv },
    });

    await obj.save();

    this.type.loadTypeObjects(this.type.currentType);
    this.types.fetchAgain();
  }
}
