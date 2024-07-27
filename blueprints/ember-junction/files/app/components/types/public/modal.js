import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { later } from '@ember/runloop';

export default class TypesPublicModalComponent extends Component {
  @service type;
  @service types;
  @service colormodes;

  @action
  copyFormLink(e) {
    e.target.innerHTML = 'Copied!';
    navigator.clipboard.writeText(
      window.location.origin +
        '/' +
        this.type.currentType.slug +
        '/public/form',
    );

    later(
      this,
      () => {
        e.target.innerHTML = '<i class="fa-solid fa-copy"></i> Copy API URL';
      },
      2000,
    );
  }
}
