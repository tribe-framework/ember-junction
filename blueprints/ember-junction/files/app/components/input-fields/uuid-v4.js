import Component from '@glimmer/component';
import { action } from '@ember/object';
import { v4 as uuidv4 } from 'uuid';

export default class InputFieldsUuidV4 extends Component {
  @action
  generateUUIDv4() {
    this.args.mutObjectModuleValue(this.args.module.input_slug, uuidv4());
  }
}
