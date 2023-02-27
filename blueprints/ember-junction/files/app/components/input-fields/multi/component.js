import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldsMultiComponent extends Component {
  @tracked fieldValue = '';
  @tracked isSaved = true;

  @action
  initiateFieldValue() {
    this.fieldValue =
      this.args.object[this.args.module.input_slug] !== undefined
        ? Array.isArray(this.args.object[this.args.module.input_slug])
          ? this.args.object[this.args.module.input_slug][this.args.index]
          : this.args.object[this.args.module.input_slug]
        : '';
  }

  @action
  setIsSaved(isSaved) {
    this.isSaved = isSaved;

    if (isSaved == true)
      this.args.mutObjectModuleValue(
        this.args.module.input_slug,
        this.fieldValue,
        true,
        this.args.index
      );
  }
}
