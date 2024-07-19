import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { later } from '@ember/runloop';

export default class TypesNewModelComponent extends Component {
  @tracked trackName = '';
  @tracked trackPlural = '';
  @tracked trackDescription = '';
  @tracked trackPrimary = 'title';
  @service types;
  @tracked modelBox = null;

  get initiatedType() {}

  convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '')
      .replace(/-/g, '_');
  };

  @action
  initModel() {
    this.modelBox = new Modal(document.getElementById('newModel'), {});

    const myModalEl = document.getElementById('newModel');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }

  @action
  async save() {
    if (this.trackName != '' && this.trackPlural != '') {
      var exists = false;
      Object.keys(this.types.json.modules).forEach((track) => {
        if (track != 'webapp') {
          if (
            track == this.convertToSlug(this.trackName) ||
            this.types.json.modules[track].name.toLowerCase() ==
              this.trackName.toLowerCase() ||
            this.types.json.modules[track].plural.toLowerCase() ==
              this.trackName.toLowerCase() ||
            this.types.json.modules[track].name.toLowerCase() ==
              this.trackPlural.toLowerCase() ||
            this.types.json.modules[track].plural.toLowerCase() ==
              this.trackPlural.toLowerCase()
          ) {
            exists = true;
          }
        }
      });

      if (exists) {
        alert('A track with this name already exists.');
      } else {
        this.types.json.modules[this.convertToSlug(this.trackName)] = {
          name: this.trackName,
          slug: this.convertToSlug(this.trackName),
          plural: this.trackPlural,
          description: this.trackDescription,
          modules: [
            {
              input_slug: this.convertToSlug(this.trackPrimary),
              input_primary: true,
              input_type: 'text',
              var_type: 'string',
              input_placeholder: 'Enter ' + this.trackPrimary,
              input_unique: false,
              list_field: true,
              list_searchable: true,
              list_sortable: true,
            },
          ],
        };
        await this.types.json.save();
        this.modelBox.hide();
        later(
          this,
          () => {
            window.location.reload(true);
          },
          1000,
        );
      }
    } else {
      alert('Name and plural fields are compulsory.');
    }
  }
}
