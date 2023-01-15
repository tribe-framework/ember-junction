import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InputFieldsTextareaMultiComponent extends Component {
  @tracked fieldValue = "";

  @action
  initiateFieldValue() {
    this.fieldValue = 
    (
      this.args.object[this.args.module.input_slug] !== undefined 
      ? (
	      	Array.isArray(this.args.object[this.args.module.input_slug])
	      	? this.args.object[this.args.module.input_slug][this.args.index]
	      	: this.args.object[this.args.module.input_slug]
	    ) 
      : ""
    );
  }
}
