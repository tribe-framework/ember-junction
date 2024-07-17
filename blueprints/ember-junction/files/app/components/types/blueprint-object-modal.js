import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class TypesBlueprintObjectModalComponent extends Component {
  @service object;

  @action
  copyJSON(object, e) {
    e.target.innerHTML = 'Copied!';
    navigator.clipboard.writeText(JSON.stringify(object, null, '\t'));

    later(
      this,
      () => {
        e.target.innerHTML = '<i class="fa-solid fa-copy"></i> Copy JSON';
      },
      2000,
    );
  }

  @action
  copyAPILink(type, id, e) {
    e.target.innerHTML = 'Copied!';
    navigator.clipboard.writeText(
      ENV.TribeENV.API_URL + '/api.php/' + type + '/' + id,
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
