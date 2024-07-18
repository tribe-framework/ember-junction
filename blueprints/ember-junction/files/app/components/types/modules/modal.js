import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class TypesModulesModalComponent extends Component {
  @service type;
  @service types;
  @service module;
  @service colormodes;
}
