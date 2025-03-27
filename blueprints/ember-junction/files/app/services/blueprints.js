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
  @service auth;

  @tracked junctionBlueprints = [];
  @tracked myBlueprints = [];

  isValidURL = (urlString) => {
    try {
      new URL(urlString);
      return true; // The string is a valid URL
    } catch (e) {
      return false; // The string is not a valid URL
    }
  };

  @action
  async downloadCurrentBlueprint(j = '') {
    this.type.loadingSearchResults = true;

    if (this.isValidURL(j)) {
      j = await fetch(j).then(function (response) {
        return response.json();
      });
    } else if (
      typeof j === 'object' &&
      j.isTrusted === undefined &&
      j !== null &&
      !Array.isArray(j)
    ) {
      j = j;
    } else {
      j = this.types.json.modules;
    }

    var types_json = [];
    Object.entries(j).forEach((v, i) => {
      let type_slug = v[0];
      let type_obj = v[1];

      if (
        type_slug != 'deleted_record' &&
        type_slug != 'blueprint_record' &&
        type_slug != 'file_record' &&
        type_slug != 'apikey_record'
      ) {
        types_json[type_slug] = type_obj;
      }
    });

    later(
      this,
      () => {
        const jsonString = JSON.stringify(
          Object.fromEntries(Object.entries(types_json)),
          null,
          2,
        );

        // Create a Blob from the JSON string
        const blob = new Blob([jsonString], { type: 'application/json' });

        // Create a link element
        let t = Math.floor(new Date().getTime() / 1000);

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Blueprint-' + t + '.types.json';

        // Append to the document and trigger the download
        document.body.appendChild(link);
        link.click();

        // Clean up and remove the link
        document.body.removeChild(link);

        this.type.loadingSearchResults = false;
      },
      1000,
    );
  }

  @action
  async changeBlueprint(j, implementationSummary = '') {
    if (j.modules !== undefined) {
      if (!this.isValidURL(j) && j.modules.types_json !== undefined) {
        let t = j.modules.types_json;
        this.type.loadingSearchResults = true;
        this.types.json.modules = t;
        await this.types.json.save();
        window.location.href = '/';
      } else if (j.modules.url !== undefined) {
        let link = j.modules.url;

        await this.types.saveCurrentTypes(this.types.json.modules);

        this.type.loadingSearchResults = true;

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

        types_json['webapp']['implementation_summary'] = implementationSummary;

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

          if (implementationSummary != '') {
            later(
              this,
              () => {
                window.location.href = '/#showImplementationSummary';
                window.location.reload(true);
              },
              300,
            );
          } else window.location.href = '/';
        } else {
          this.type.loadingSearchResults = false;
        }
      }
    }
  }

  @action
  async clearBlueprint() {
    // Display the confirmation dialog
    var userResponse = confirm(
      'Are you sure you want to clear the blueprint? This will remove all your tracks. This does not affect the data saved. You can undo this step.',
    );

    if (userResponse) {
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
  }

  @action
  async getBlueprints() {
    if (
      this.auth.projectDescription != '' &&
      Object.entries(this.types.json.modules).length <= 5
    ) {
      await this.getAI();
    } else if (
      this.auth.blueprintLink != '' &&
      Object.entries(this.types.json.modules).length <= 5
    ) {
      this.changeBlueprint(
        this.auth.blueprintLink,
        this.auth.implementationSummary,
      );
    } else {
      this.myBlueprints = await this.store.query('blueprint_record', {
        show_public_objects_only: false,
      });

      let data = await fetch(
        'https://tribe.junction.express/api.php/blueprint',
      ).then(function (response) {
        return response.json();
      });
      this.junctionBlueprints = data.data;

      //show implementation summary
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);
      const hash = url.hash;
      if (hash == '#showImplementationSummary') {
        document.querySelector('#blueprintConsultationModal-btn').click();
      }
    }
  }

  @tracked projectDescription = this.types.json.modules.webapp
    .project_description
    ? this.types.json.modules.webapp.project_description
    : this.auth.projectDescription;

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
                window.location.href = '/#showImplementationSummary';
                window.location.reload(true);
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
          type_slug != 'apikey_record' &&
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
