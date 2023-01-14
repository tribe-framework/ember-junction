import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class InputFieldsSelectComponent extends Component {
  @action
  updateValue(e) {
    this.args.object[this.args.module.input_slug] = e.target.value;
  }

  get currentValue() {
    return this.args.object[this.args.module.input_slug] !== undefined
      ? this.args.object[this.args.module.input_slug]
      : false;
  }
}
