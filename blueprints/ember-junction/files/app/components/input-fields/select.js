import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class InputFieldsSelectComponent extends Component {
  @service store;

  @tracked options = null;

  @action
  updateValue(e) {
    this.args.object[this.args.module.input_slug] = e.target.value;
  }

  get currentValue() {
    return this.args.object[this.args.module.input_slug] !== undefined
      ? this.args.object[this.args.module.input_slug]
      : false;
  }

  @action
  isModuleAlsoAType() {
    //if this module is also a type append input_options from that type content
    if (this.args.webapp.modules[this.args.module.input_slug] !== undefined) {
      this.options = this.store.query(this.args.module.input_slug, {
        show_public_objects_only: false,
        page: { limit: -1 },
      });
    }
  }
}
