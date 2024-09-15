import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class InputFieldsMultiComponent extends Component {
  @service object;

  get lengthMinusOne() {
    if (
      this.object.currentObject === null ||
      this.object.currentObject.modules[this.args.module.input_slug] ===
        undefined
    )
      return 0;
    else
      return (
        this.object.currentObject.modules[this.args.module.input_slug].length -
        1
      );
  }
}
