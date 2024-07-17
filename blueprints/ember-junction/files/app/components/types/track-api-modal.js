import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class TypesTrackApiModalComponent extends Component {
  @service type;
  @service colormodes;

  @action
  copyAPILink(e) {
    e.target.innerHTML = 'Copied!';
    navigator.clipboard.writeText(
      ENV.TribeENV.API_URL + '/api.php/' + this.type.currentType.slug,
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
