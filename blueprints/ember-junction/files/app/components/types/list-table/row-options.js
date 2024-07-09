import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';

export default class TypesListTableRowOptionsComponent extends Component {
  isLastSlashOrEquals = (id) => {
    let last = id.substr(id.length - 1);
    if (last == '/' || last == '=') return true;
    else return false;
  };

  @service object;
  @service colormodes;

  @action
  openBlueprintModal() {
    this.object.currentObject = this.args.object;
    this.object.currentType = this.args.type;
    let bp = new Modal(document.getElementById('blueprintObjectModal'), {});
    bp.show();
  }
}
