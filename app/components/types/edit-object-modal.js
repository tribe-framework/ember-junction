import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TypesEditObjectModalComponent extends Component {
  @service store;
  @tracked objectModules = this.args.object ? this.args.object.modules : {};

  @action
  pushObject() {
    let vvv = this.objectModules;

    if (
      this.args.object !== null &&
      this.args.object !== undefined &&
      this.args.object.id !== null
    ) {
      this.store
        .findRecord(this.args.object.modules.type, this.args.object.modules.id)
        .then((obj) => {
          obj.modules = vvv;
          obj.save();
        });
    } else {
      let obj = this.store.createRecord(this.args.type.slug, {
        modules: vvv,
      });
      obj.save();
      //this.store.unloadAll(this.args.type.slug);
    }
  }

  @action
  deleteObject() {
    if (
      this.args.object !== null &&
      this.args.object !== undefined &&
      this.args.object.id !== null
    ) {
      let obj = this.store.peekRecord(
        this.args.object.modules.type,
        this.args.object.modules.id
      );
      obj.destroyRecord();
    }
  }

  @action
  notSoSure() {
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.add('d-none');
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.remove('d-flex');
  }

  @action
  areYouSure() {
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.add('d-flex');
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.remove('d-none');
  }
}
