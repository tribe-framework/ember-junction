import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TypesController extends Controller {
  @service store;

  @tracked currentType = null;
  @tracked objectsInType = null;

  @action
  loadTypeObjects(type) {
    this.currentType = type;
    this.objectsInType = this.store.findAll(type.slug, {show_public_objects_only: false});
  }
}
