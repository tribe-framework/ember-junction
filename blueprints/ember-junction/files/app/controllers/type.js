import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class TypeController extends Controller {
  @service type;

  @action
  changeType() {
    this.type.currentType = this.model;
    this.type.loadTypeObjects();
  }
}
