import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';

export default class TypesWebappComponent extends Component {
  @service types;
  @tracked webappBox = null;

  @action
  initWebapp() {
    this.webappBox = new Modal(document.getElementById('typesWebapp'), {});

    const myModalEl = document.getElementById('typesWebapp');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }

  @action
  async save() {
    await this.types.json.save();
    this.webappBox.hide();
  }
}
