import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TypesEditObjectModalComponent extends Component {
  @service store;
  @tracked objectModules = this.args.object ? this.args.object.modules : {};

  @action
  saveObject() {
    let vvv = this.objectModules;
    
    let obj = this.store.createRecord(this.args.type.slug, {
      modules: vvv,
    });
    obj.save();
  }
}