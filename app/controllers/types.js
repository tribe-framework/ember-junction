import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TypesController extends Controller {
  @service store;

  @tracked currentType = false;
  @tracked currentObject = false;
  @tracked objectsInType = false;

  @action
  loadTypeObjects(type) {
    this.currentType = type;
    this.objectsInType = this.store.findAll(type.slug);
  }

  @action
  editObject() {
    const editObjectModal = new bootstrap.Modal('#editObjectModal', {});
    editObjectModal.show();
  }
}
