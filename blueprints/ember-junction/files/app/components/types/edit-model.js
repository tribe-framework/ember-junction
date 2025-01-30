import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { Modal } from 'bootstrap';
import { later } from '@ember/runloop';

export default class TypesEditModelComponent extends Component {
  @tracked trackName = '';
  @tracked trackPlural = '';
  @tracked trackURL = '';
  @tracked trackDescription = '';
  @tracked apiHooks = [];
  @tracked sendable = false;
  @tracked readonly = false;
  @tracked editable = true;
  @tracked trackPrimary = 'title';
  @service types;
  @service colormodes;
  @service type;
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
    this.modelBox = new Modal(document.getElementById('editModel'), {});

    const myModalEl = document.getElementById('editModel');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
    myModalEl.addEventListener('show.bs.modal', async (event) => {
      let typeSlug = this.type.currentType.slug;
      this.trackName = this.types.json.modules[typeSlug]['name'];
      this.trackPlural = this.types.json.modules[typeSlug]['plural'];
      this.trackURL = this.types.json.modules[typeSlug]['url'];
      this.trackDescription = this.types.json.modules[typeSlug]['description'];
      this.apiHooks = this.types.json.modules[typeSlug]['api_hooks'];
      this.sendable = this.types.json.modules[typeSlug]['sendable'];
      this.readonly = this.types.json.modules[typeSlug]['readonly'];
      this.editable =
        this.types.json.modules[typeSlug]['editable'] !== undefined
          ? this.types.json.modules[typeSlug]['editable']
          : true;
    });
  }

  @action
  async save(e) {
    if (this.trackName != '' && this.trackPlural != '') {
      this.colormodes.buttonLoading(e);
      let typeSlug = this.type.currentType.slug;
      this.types.json.modules[typeSlug]['name'] = this.trackName;
      this.types.json.modules[typeSlug]['plural'] = this.trackPlural;
      this.types.json.modules[typeSlug]['url'] = this.trackURL;
      this.types.json.modules[typeSlug]['description'] = this.trackDescription;
      this.types.json.modules[typeSlug]['api_hooks'] = this.apiHooks;
      this.types.json.modules[typeSlug]['sendable'] = this.sendable;
      this.types.json.modules[typeSlug]['readonly'] = this.readonly;
      this.types.json.modules[typeSlug]['editable'] = this.editable;

      await this.types.json.save();
      await this.types.fetchAgain();
      this.colormodes.buttonUnloading(e);
      this.modelBox.hide();
    } else {
      alert('Name and plural are compulsory.');
    }
  }
}
