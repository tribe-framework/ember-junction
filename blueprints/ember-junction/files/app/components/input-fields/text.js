import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class InputFieldsTextComponent extends Component {
  @service object;

  @action
  async generateTitle() {
    let Passphrase = window.Passphrase;
    let passphrase = await Passphrase.generate(36);
    this.args.mutObjectModuleValue(this.args.module.input_slug, passphrase);
  }

  inputType = (type) => {
    if (type === 'number') {
      return 'text';
    }

    return type;
  };

  inputMode = (type) => {
    switch (type) {
      case 'password':
        type = 'text';
        break;

      case 'number':
        type = 'numeric';
        break;

      default:
        break;
    }

    return type;
  };
}
