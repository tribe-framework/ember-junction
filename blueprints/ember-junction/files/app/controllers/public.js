import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';

export default class PublicController extends Controller {
  @service type;
  @service types;
  @service object;
  @service colormodes;

  @action
  initType() {
    this.type.currentType = this.types.json.modules[this.model.slug];
    this.type.editorJSOnTypeChange();
  }

  @action
  openNewModal() {
    this.object.viaPublicForm = true;
    this.object.reloadingVars = true;
    this.object.currentObject = null;
    this.object.reloadingVars = false;
    let bp = new Modal(document.getElementById('editObjectModal'), {});
    bp.show();
  }
}
