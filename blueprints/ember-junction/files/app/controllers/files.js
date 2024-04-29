import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class FilesController extends Controller {
  @service types;

  @tracked query = "";
  @tracked results = null;
  @tracked loading = false;

  getLength = (e)=>{
    return Object.keys(e).length;
  }

  @action
  async search() {
    this.results = null;
  	this.loading = true;
  	const response = await fetch(ENV.TribeENV.API_URL + '/custom/junction/files/search.php?q='+encodeURI(this.query));
  	this.results = await response.json();
    console.log(this.results);
  	this.loading = false;
  }
}
