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
  mutObjectModuleValue(module_input_slug, value) {
    this.objectModules[module_input_slug] = value;
    this.objectModules = this.objectModules;
  }

  @action
  initEditorJS(module_input_slug) {
    this.editorjsInstances[this.args.type.slug+'-'+module_input_slug+'-'+this.args.object.modules.id] = new EditorJS({
      holder: this.args.type.slug+'-'+module_input_slug+'-'+this.args.object.modules.id,
      data: this.args.object.modules[module_input_slug],
      placeholder: this.args.type.modules[module_input_slug].input_placeholder
    });
    this.editorjsInstances = this.editorjsInstances;
  }

  @action
  saveAllEditorJS() {

  }

}
