import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesModulesListComponent extends Component {
  @service type;
  @service colormodes;
  @service module;
}
