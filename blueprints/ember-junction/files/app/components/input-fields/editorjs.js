import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { Modal } from 'bootstrap';

export default class InputFieldsEditorjsComponent extends Component {
  @service object;

  @action
  async cleanVarsOnNewModalOpen(input_slug) {
    const myModal = document.getElementById('editObjectModal');
    myModal.addEventListener('show.bs.modal', async (event) => {
      await this.args.initEditorJS(input_slug);
    });
    myModal.addEventListener('hidden.bs.modal', async (event) => {
      await this.args.uninitEditorJS(input_slug);
    });
  }
}
