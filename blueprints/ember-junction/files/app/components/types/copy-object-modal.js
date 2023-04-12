import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesCopyObjectModalComponent extends Component {
  @service store;
  @service types;

  @action
  async pushObject() {
    const vvv = this.args.object.modules;
    delete vvv.id;
    delete vvv.slug;

    let obj = await this.store.createRecord(this.args.type.slug, {
      modules: { ...vvv },
    });

    await obj.save();

    this.args.loadTypeObjects(this.args.type);
    this.types.fetchAgain();
  }
}
