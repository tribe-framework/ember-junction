import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { later } from '@ember/runloop';
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
    types_json['webapp']['project_description'] = '';

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

  @tracked loadingProgress = 0;
  @tracked tryAgain = false;
  @tracked totalTime = 0;

  progressLoading = () => {
    if (this.loadingProgress < 89) this.loadingProgress += 10;
    this.totalTime += 5;

    if (this.totalTime > 70) {
      clearInterval(intervalId);
      this.getAI();
    }
  };

  @action
  async getAI() {
    if (this.projectDescription != '') {
      this.loadingProgress = 5;
      this.totalTime = 5;
      await this.types.saveCurrentTypes(this.types.json.modules);

      let intervalId = setInterval(this.progressLoading, 5000);

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
        if (
          (data.error !== undefined && data.error) ||
          data.json === undefined
        ) {
          this.loadingProgress = 0;
          this.tryAgain = true;
        } else {
          let data_json = data.json;

          if (data_json === undefined) {
            this.loadingProgress = 0;
            this.tryAgain = true;
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

            types_json['webapp']['project_description'] =
              this.projectDescription;
            types_json['webapp']['implementation_summary'] = data.html;

            if (data_json) {
              this.types.json.modules = {
                ...Object.assign({}, types_json),
                ...Object.assign({}, link_json),
              };
              await this.types.json.save();

              this.loadingProgress = 100;
              clearInterval(intervalId);
            }

            later(
              this,
              () => {
                window.location.href = '/';
              },
              300,
            );
          }
        }
      } else {
        this.loadingProgress = 0;
        this.tryAgain = true;
      }
    }
  }

  @action
  async getSampleData() {
    if (this.projectDescription != '') {
      this.type.loadingSearchResults = true;

      var types_json = [];
      Object.entries(this.types.json.modules).forEach((v, i) => {
        let type_slug = v[0];
        let type_obj = v[1];

        if (
          type_slug != 'webapp' &&
          type_slug != 'deleted_record' &&
          type_slug != 'file_record' &&
          type_slug != 'blueprint_record'
        ) {
          types_json[type_slug] = type_obj;
        }
      });

      let data = await fetch(
        'https://tribe.junction.express/custom/anthropic/get-sample-data.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_description: this.projectDescription,
            type: this.type.currentType.slug,
            implementation_summary:
              this.types.json.modules.webapp.implementation_summary,
            types_json: { ...Object.assign({}, types_json) },
          }),
        },
      ).then(function (response) {
        return response.json();
      });

      if (data !== undefined && data && data.objects) {
        Object.entries(data.objects).forEach(async (v, i) => {
          let obj = v[1];
          let vv = this.store.createRecord(this.type.currentType.slug, {
            modules: { ...obj },
          });
          await vv.save();
        });

        window.location.href = '/track/' + this.type.currentType.slug;
      } else {
        this.type.loadingSearchResults = false;
      }
    }
  }
}
