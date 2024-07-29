import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesSummaryCardComponent extends Component {
  @service types;
  @service type;
  @service router;
  @service colormodes;

  @action
  changeType(type) {
    this.type.editorJSOnTypeChange();
    this.type.currentType = type;
    this.type.loadTypeObjects();
    this.router.transitionTo('type', type);
  }
}
