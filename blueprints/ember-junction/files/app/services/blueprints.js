import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class BlueprintsService extends Service {
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

    let data_json = await fetch(link).then(function (response) {
      return response.json();
    });

    var types_json = [];
    Object.entries(this.types.json.modules).forEach((v, i) => {
      let type_slug = v[0];
      let type_obj = v[1];

      if (type_slug == 'webapp') {
        types_json['webapp'] = type_obj;
      }
    });

    types_json['webapp']['implementation_summary'] = '';

    if (data_json !== undefined && data_json) {
      var link_json = [];
      Object.entries(data_json).forEach((v, i) => {
        let type_slug = v[0];
        let type_obj = v[1];

        if (type_slug != 'webapp') {
          link_json[type_slug] = type_obj;
        }
      });

      this.types.json.modules = {
        ...Object.assign({}, types_json),
        ...Object.assign({}, link_json),
      };
      await this.types.json.save();
      window.location.href = '/';
    } else {
      this.type.loadingSearchResults = false;
    }
  }

  @action
  async clearBlueprint() {
    this.type.loadingSearchResults = true;

    await this.types.saveCurrentTypes(this.types.json.modules);

    var types_json = [];
    Object.entries(this.types.json.modules).forEach((v, i) => {
      let type_slug = v[0];
      let type_obj = v[1];

      if (type_slug == 'webapp') {
        types_json['webapp'] = type_obj;
      }
    });

    types_json['webapp']['implementation_summary'] = '';

    this.types.json.modules = {
      ...Object.assign({}, types_json),
    };
    await this.types.json.save();
    window.location.href = '/';
  }

  @action
  async revertBlueprint(t) {
    this.type.loadingSearchResults = true;
    this.types.json.modules = t;
    await this.types.json.save();
    window.location.href = '/';
  }

  @action
  async getBlueprints() {
    let data = await fetch(
      'https://tribe.junction.express/api.php/blueprint',
    ).then(function (response) {
      return response.json();
    });
    this.junctionBlueprints = data.data;
    this.myBlueprints = await this.store.query('deleted_record', {
      modules: { deleted_type: 'blueprint_record' },
    });
  }

  @tracked projectDescription = this.types.json.modules.webapp
    .project_description
    ? this.types.json.modules.webapp.project_description
    : '';

  @action
  async getAI() {
    if (this.projectDescription != '') {
      this.type.loadingSearchResults = true;
      await this.types.saveCurrentTypes(this.types.json.modules);

      let data = await fetch(
        'https://tribe.junction.express/custom/anthropic/get-response.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_description: this.projectDescription,
          }),
        },
      ).then(function (response) {
        return response.json();
      });

      if (data !== undefined && data && data.json) {
        let data_json = JSON.parse(data.json);

        if (data_json === undefined) {
          console.log('tried');
          this.getAI();
        } else {
          var types_json = [];
          Object.entries(this.types.json.modules).forEach((v, i) => {
            let type_slug = v[0];
            let type_obj = v[1];

            if (type_slug == 'webapp') {
              types_json['webapp'] = type_obj;
            }
          });

          var link_json = [];
          Object.entries(data_json).forEach((v, i) => {
            let type_slug = v[0];
            let type_obj = v[1];

            if (type_slug != 'webapp') {
              link_json[type_slug] = type_obj;
            }
          });

          types_json['webapp']['project_description'] = this.projectDescription;
          types_json['webapp']['implementation_summary'] = data.html;

          if (data_json) {
            this.types.json.modules = {
              ...Object.assign({}, types_json),
              ...Object.assign({}, link_json),
            };
            await this.types.json.save();

            this.type.loadingSearchResults = false;
          }

          window.location.href = '/';
        }
      } else {
        this.type.loadingSearchResults = false;
      }
    }
  }
}
