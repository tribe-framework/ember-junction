import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { Modal } from 'bootstrap';

export default class InputFieldsEditorjsComponent extends Component {
  @service object;
  @service type;

  @action
  async cleanVarsOnNewModalOpen(input_slug) {
    let i = async (event) => {
      await this.args.initEditorJS(input_slug);
    };
    this.type.showModalEvents.push(i);

    let u = async (event) => {
      await this.args.uninitEditorJS(input_slug);
    };
    this.type.hideModalEvents.push(u);

    this.type.editObjectModal.addEventListener('show.bs.modal', i);
    this.type.editObjectModal.addEventListener('hidden.bs.modal', u);
  }
}
