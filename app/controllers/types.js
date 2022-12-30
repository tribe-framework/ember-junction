import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class TypesController extends Controller {
  @service store;

  @tracked type = false;
  @tracked currentObject = false;
  @tracked objects = false;

  @action
  loadTypeObjects(type) {
    this.type = type;
    this.objects = this.store.findAll(type);
  }

  @action
  createNewPost() {
    const newObjectModal = new bootstrap.Modal('#newObjectModal', {});
    newObjectModal.show();
  }
}
