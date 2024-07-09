import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class FilesController extends Controller {
  @service types;
  @service colormodes;

  @tracked query = '';
  @tracked results = null;
  @tracked loading = false;
  @tracked deepSearch = false;

  getLength = (e) => {
    return Object.keys(e).length;
  };

  @action
  async search() {
    this.results = null;
    this.loading = true;
    await fetch(ENV.TribeENV.API_URL + '/uploads.php', {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        search: true,
        q: encodeURI(this.query),
        deep_search: this.deepSearch,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        this.results = response;
        this.loading = false;
      });
  }
}
