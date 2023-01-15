import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import EditorJS from '@editorjs/editorjs';

export default class TypesEditObjectModalComponent extends Component {
  @service store;
  @service router;
  @tracked objectModules = this.args.object ? this.args.object.modules : {};
  @tracked objectID = this.args.object ? this.args.object.modules.id : 'new';
  @tracked editorjsInstances = [];

  @action
  pushObject() {
    let vvv = this.objectModules;
    if (
      this.args.object !== null &&
      this.args.object !== undefined &&
      this.args.object.id !== null
    ) {
      this.store
        .findRecord(this.args.object.modules.type, this.args.object.modules.id)
        .then((obj) => {
          obj.modules = vvv;
          obj.save();
        });
    } else {
      let obj = this.store.createRecord(this.args.type.slug, {
        modules: vvv,
      });
      obj.save();
      //window.location.href="/types";
    }
  }

  @action
  deleteObject() {
    if (
      this.args.object !== null &&
      this.args.object !== undefined &&
      this.args.object.id !== null
    ) {
      let obj = this.store.peekRecord(
        this.args.object.modules.type,
        this.args.object.modules.id
      );
      obj.destroyRecord();
    }
  }

  @action
  notSoSure() {
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.add('d-none');
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.remove('d-flex');
  }

  @action
  areYouSure() {
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.add('d-flex');
    document
      .querySelector('#deleteObjectConfirmation-' + this.args.object.id)
      .classList.remove('d-none');
  }

  @action
  mutObjectModuleValue(module_input_slug, value, index = false) {
    if (index === undefined || index == false) {
      if (this.objectModules[module_input_slug] === undefined)
        this.objectModules[module_input_slug] = "";
      this.objectModules[module_input_slug] = value;
    }
    else {
      if (this.objectModules[module_input_slug] === undefined)
        this.objectModules[module_input_slug] = [];
      this.objectModules[module_input_slug][index] = value;
    }

    this.objectModules = this.objectModules;
    console.log(this.objectModules);
  }

  @action
  initEditorJS(module_input_slug, id) {
    var editor_object_in_type = Object(this.args.type.modules).find(function (
      element
    ) {
      if (element['input_slug'] == module_input_slug) return element;
    });

    this.editorjsInstances[
      this.args.type.slug + '-' + module_input_slug + '-' + id
    ] = new EditorJS({
      holder: this.args.type.slug + '-' + module_input_slug + '-' + id,
      data: this.args.object ? this.args.object.modules[module_input_slug] : {},
      placeholder: editor_object_in_type.input_placeholder,
    });

    this.editorjsInstances = this.editorjsInstances;
  }

  @action
  saveAllEditorJS() {
    this.editorjsInstances.forEach((currentEditor, index) => {
      this.editorjsInstances[index]
        .save()
        .then((outputData) => {
          console.log('Article data: ', outputData);
        })
        .catch((error) => {
          console.log('Saving failed: ', error);
        });
    });
  }

  @action
  addFieldAfter(index) {
    console.log('add after '+index);
  }

  @action
  removeThisField(index) {
    console.log('remove '+index);
  }
}
