import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class TypesSummaryCardComponent extends Component {
  @service types;
  @service type;
  @service router;

  @action
  changeType(type) {
    this.type.currentType = type;
    this.type.loadTypeObjects();
    this.router.transitionTo('type', type);
  }
}
