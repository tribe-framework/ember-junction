import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { later } from '@ember/runloop';

export default class TypesDeleteModelComponent extends Component {
  @service type;
  @service types;
  @service router;
  @tracked modelBox = null;

  @action
  initModel() {
    this.modelBox = new Modal(document.getElementById('deleteModel'), {});

    const myModalEl = document.getElementById('deleteModel');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }
  @action
  async delete() {
    if (this.type.currentType.slug !== undefined) {
      delete this.types.json.modules[this.type.currentType.slug];
      await this.types.json.save();

      this.modelBox.hide();
      later(
        this,
        () => {
          this.router.transitionTo('index');
        },
        700,
      );
    }
  }
}
