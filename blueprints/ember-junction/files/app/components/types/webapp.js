import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class TypesWebappComponent extends Component {
  @service types;
  @service colormodes;
  @tracked webappBox = null;

  get isJunctionExpress() {
    if (ENV.JUNCTION_SLUG == 'junction') {
      return false;
    } else {
      return true;
    }
  }

  @action
  initWebapp() {
    this.webappBox = new Modal(document.getElementById('typesWebapp'), {});

    const myModalEl = document.getElementById('typesWebapp');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }

  @action
  async save(e) {
    this.colormodes.buttonLoading(e);
    await this.types.json.save();
    this.colormodes.buttonUnloading(e);
    this.webappBox.hide();
  }
}
