import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class TypesBlueprintsAiPromptComponent extends Component {
  @service blueprints;
  @service colormodes;
}
