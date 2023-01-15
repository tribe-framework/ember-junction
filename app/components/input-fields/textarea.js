import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldsTextareaComponent extends Component {
  @tracked fieldValue = "";
  @tracked fieldValues = [""];

  @action
  initiateFieldValue() {
    this.fieldValue = 
    (
      this.args.object[this.args.module.input_slug] !== undefined 
      ? this.args.object[this.args.module.input_slug] 
      : ""
    );
  }

  @action
  initiateFieldValues() {
    this.fieldValues = 
    (
      this.args.object[this.args.module.input_slug] !== undefined
      ? (
          Array.isArray(this.args.object[this.args.module.input_slug])
          ? this.args.object[this.args.module.input_slug]
          : [this.args.object[this.args.module.input_slug]]
        )
      : [""]
    );
  }

}
