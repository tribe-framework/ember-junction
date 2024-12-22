import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { later } from '@ember/runloop';

export default class TypesModulesNewComponent extends Component {
  @service type;
  @service module;
  @service colormodes;
  @tracked moduleName = '';
  @service types;
  @tracked modelBox = null;

  convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '')
      .replace(/-/g, '_');
  };

  @action
  initModel() {
    this.modelBox = new Modal(document.getElementById('newModuleModel'), {});

    const myModalEl = document.getElementById('newModuleModel');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }

  @action
  async save(e) {
    this.colormodes.buttonLoading(e);
    if (this.moduleName != '') {
      let slug = this.type.currentType.slug;
      var exists = false;

      this.types.json.modules[slug].modules.forEach((module) => {
        if (module.input_slug == this.convertToSlug(this.moduleName)) {
          exists = true;
        }
      });

      if (exists) {
        alert('A module with this name already exists.');
      } else {
        this.types.json.modules[slug].modules.push({
          input_slug: this.convertToSlug(this.moduleName),
          input_type: 'text',
          input_placeholder: this.moduleName,
          list_field: false,
          list_searchable: false,
          list_sortable: false,
          var_type: 'string',
        });
        await this.types.json.save();
        this.modelBox.hide();
        this.moduleName = '';
        this.types.fetchAgain();
        document.querySelector('#track-' + slug).click();
      }
      this.colormodes.buttonUnloading(e);
    } else {
      this.colormodes.buttonUnloading(e);
      alert('Module name field is compulsory.');
    }
  }
}
