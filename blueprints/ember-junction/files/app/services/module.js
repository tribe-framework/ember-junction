import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { Modal } from 'bootstrap';

export default class ModuleService extends Service {
  @service type;
  @tracked currentModule = null;
  @service types;
  @tracked modelBox = null;

  inputTypes = [
    { title: 'Text', slug: 'text', var: 'string', multi: false },
    { title: 'Textarea', slug: 'textarea', var: 'string', multi: false },
    { title: 'Rich text editor', slug: 'editorjs', var: 'json', multi: false },
    { title: 'Select', slug: 'select', var: 'string', multi: false },
    { title: 'URL', slug: 'url', var: 'string', multi: false },
    { title: 'Password', slug: 'password', var: 'string', multi: false },
    { title: 'Hidden', slug: 'hidden', var: 'string', multi: false },
    { title: 'Email address', slug: 'email', var: 'string', multi: false },
    { title: 'Phone number', slug: 'tel', var: 'string', multi: false },
    { title: 'Number', slug: 'number', var: 'int', multi: false },
    {
      title: 'Date and time',
      slug: 'datetime-local',
      var: 'string',
      multi: false,
    },
    { title: 'Date only', slug: 'date', var: 'string', multi: false },
    { title: 'Time only', slug: 'time', var: 'string', multi: false },
    {
      title: 'File uploader',
      slug: 'file_uploader',
      var: 'json',
      multi: false,
    },
    { title: 'Color', slug: 'color', var: 'string', multi: false },
    { title: 'Checkbox', slug: 'checkbox', var: 'bool', multi: false },
  ];

  @tracked selectedInputType = null;
  @tracked listField = null;
  @tracked listSearchable = null;
  @tracked listSortable = null;
  @tracked linkedType = '';
  @tracked linkedTypesAvailable = [];
  @tracked inputMultiple = false;
  @tracked inputRequired = false;
  @tracked inputPrimary = false;
  @tracked inputUnique = false;

  @action
  changeLinkedType(e) {
    if (e == 'Select linked track') this.linkedType = '';
    else this.linkedType = e;
  }

  @action
  changeModule(module) {
    this.linkedTypesAvailable = [];
    this.linkedTypesAvailable.push('Select linked track');

    Object.entries(this.types.json.modules).forEach((tp) => {
      if (tp[1].slug != 'webapp' && tp[1].slug.includes('_record') === false) {
        this.linkedTypesAvailable.push(tp[1].slug);
      }
    });
    this.linkedTypesAvailable = this.linkedTypesAvailable;

    this.currentModule = module;

    this.inputMultiple =
      this.currentModule.input_multiple !== undefined
        ? this.currentModule.input_multiple
        : false;
    this.inputRequired =
      this.currentModule.input_required !== undefined
        ? this.currentModule.input_required
        : false;

    this.inputTypes.forEach((i) => {
      if (i.slug == this.currentModule.input_type) this.selectedInputType = i;
    });

    if (this.currentModule.linked_type !== undefined)
      this.linkedType = this.currentModule.linked_type;
    else this.linkedType = '';

    if (this.currentModule.list_field !== undefined)
      this.listField = this.currentModule.list_field;
    else this.listField = false;

    if (this.currentModule.list_searchable !== undefined)
      this.listSearchable = this.currentModule.list_searchable;
    else this.listSearchable = false;

    if (this.currentModule.list_sortable !== undefined)
      this.listSortable = this.currentModule.list_sortable;
    else this.listSortable = false;
  }

  @action
  changeInputType(e) {
    this.selectedInputType = e;
  }

  @action
  async save() {
    if (this.selectedInputType != null) {
      if (
        this.currentModule.input_placeholder === undefined ||
        this.currentModule.input_placeholder == ''
      )
        this.currentModule.input_placeholder =
          'Enter ' + this.currentModule.input_slug;

      let slug = this.type.currentType.slug;
      var exists = false;
      var ii = 0;

      this.types.json.modules[slug].modules.forEach((module) => {
        if (module.input_slug == this.currentModule.input_slug) {
          exists = ii;
        }
        ii++;
      });

      if (exists !== false) {
        if (this.currentModule.input_primary === true) {
          this.inputPrimary = true;
        } else {
          this.inputPrimary = false;
          this.inputUnique = false;
        }

        this.types.json.modules[slug].modules[exists] = {
          input_slug: this.currentModule.input_slug,
          linked_type: this.linkedType,
          input_primary: this.inputPrimary,
          input_unique: this.inputUnique,
          input_type: this.selectedInputType.slug,
          input_multiple: this.inputMultiple,
          input_required: this.inputRequired,
          input_placeholder: this.currentModule.input_placeholder,
          list_field: this.listField,
          list_searchable: this.listSearchable,
          list_sortable: this.listSortable,
          var_type: this.selectedInputType.var,
        };
        await this.types.json.save();
        this.modelBox.hide();
        this.types.fetchAgain();
        document.querySelector('#track-' + slug).click();
      }
    } else {
      alert('Form Input Type field is compulsory.');
    }
  }

  @action
  initModel() {
    this.modelBox = new Modal(document.getElementById('moduleModal'), {});

    const myModalEl = document.getElementById('moduleModal');
    myModalEl.addEventListener('hidden.bs.modal', async (event) => {
      this.types.fetchAgain();
    });
  }

  @action
  async delete() {
    if (
      confirm(
        'Are you sure you wish to deactivate the field ' +
          this.currentModule.input_slug,
      ) == true
    ) {
      let slug = this.type.currentType.slug;
      var ii = 0;

      await this.types.json.modules[slug].modules.forEach(async (module) => {
        if (module.input_slug == this.currentModule.input_slug) {
          delete this.types.json.modules[slug].modules[ii];
          console.log(this.types.json.modules[slug].modules);
        }
        ii++;
      });

      this.types.json.modules[slug].modules = this.types.json.modules[
        slug
      ].modules.filter((element) => {
        return element;
      });

      await this.types.json.save();
      this.modelBox.hide();
      this.types.fetchAgain();
      document.querySelector('#track-' + slug).click();
    } else {
    }
  }
}
