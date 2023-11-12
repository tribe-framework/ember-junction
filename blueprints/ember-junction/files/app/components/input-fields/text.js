import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class InputFieldsTextComponent extends Component {
	@action
	async generateTitle() {
		let Passphrase = window.Passphrase;
		let passphrase = await Passphrase.generate(36);
		this.args.mutObjectModuleValue(this.args.module.input_slug, passphrase);
	}
}
