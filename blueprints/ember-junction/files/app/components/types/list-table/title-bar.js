import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { action } from '@ember/object';

export default class TypesListTableTitleBarComponent extends Component {
  @service colormodes;
  @service object;
  @service type;
  @service types;
  @service store;

  @action
  openMultiModal() {
    this.object.reloadingVars = true;
    this.object.currentObject = null;
    this.object.reloadingVars = false;
    let bp = new Modal(
      document.getElementById(
        'editObjectModal-' + this.type.currentType.slug + '-multi',
      ),
      {},
    );
    bp.show();
  }

  @action
  openNewModal() {
    this.object.reloadingVars = true;
    this.object.currentObject = null;
    this.object.reloadingVars = false;
    let bp = new Modal(document.getElementById('editObjectModal'), {});
    bp.show();
  }
}
