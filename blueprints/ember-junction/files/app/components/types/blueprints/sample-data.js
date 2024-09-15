import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesBlueprintsSampleDataComponent extends Component {
  @service blueprints;
  @service colormodes;
  @service type;
}
