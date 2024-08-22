import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesBlueprintsAiPromptComponent extends Component {
	@service blueprints;
	@service colormodes;
}
