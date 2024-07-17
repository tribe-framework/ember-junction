import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesModulesNewComponent extends Component {
  @service type;
  @service module;
  @service colormodes;
}
