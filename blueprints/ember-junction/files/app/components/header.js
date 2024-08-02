import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class HeaderComponent extends Component {
  @service auth;
  @service colormodes;
  @service types;
  @service store;
  @service type;

  @tracked junctionBlueprints = [];
  @tracked myBlueprints = [];

  @action
  async changeBlueprint(link) {
    this.type.loadingSearchResults = true;

    await this.types.saveCurrentTypes(this.types.json.modules);

    let data_json = await fetch(link).then(function(response) {
      return response.json();
    });

    var types_json = [];
    Object.entries(this.types.json.modules).forEach((v,i)=>{
      let type_slug = v[0];
      let type_obj = v[1];

      if (type_slug == 'webapp') {
        types_json['webapp'] = type_obj;
      }
    });

    var link_json = [];
    Object.entries(data_json).forEach((v,i)=>{
      let type_slug = v[0];
      let type_obj = v[1];

      if (type_slug != 'webapp') {
        link_json[type_slug] = type_obj;
      }
    });

    this.types.json.modules = {...Object.assign({}, types_json), ...Object.assign({}, link_json)};
    await this.types.json.save();
    window.location.reload(true);
  }


  @action
  async revertBlueprint(t) {
    this.type.loadingSearchResults = true;
    this.types.json.modules = t;
    await this.types.json.save();
    window.location.reload(true);
  }

  @action
  async getBlueprints() {
    let data = await fetch('https://tribe.junction.express/api.php/blueprint').then(function(response) {
      return response.json();
    });
    this.junctionBlueprints = data.data;
    this.myBlueprints = await this.store.query('deleted_record', {
      modules: { deleted_type: 'type' }
    });
  }

  @action
  toggleBarsIcon() {
    let el = document.querySelector('#main-menu-toggler');
    if (el.attributes['aria-expanded'].value == 'true')
      el.innerHTML = '<i class="fa-solid fa-xmark fs-1"></i>';
    else el.innerHTML = '<i class="fa-solid fa-bars-staggered fs-1"></i>';
  }

  @action
  collapseMenu() {
    document
      .querySelector('#navbarSupportedContent')
      .classList.remove('navbar-expand');
    document.querySelector('#navbarSupportedContent').classList.remove('show');
    document
      .querySelector('#navbarSupportedContent')
      .classList.add('navbar-collapse');
    document.querySelector('#main-menu-toggler').attributes[
      'aria-expanded'
    ].value = 'false';
    //document.querySelector('.tooltip.show').classList.remove('show');
    this.toggleBarsIcon();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
