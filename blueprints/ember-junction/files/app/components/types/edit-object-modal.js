import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import { A } from '@ember/array';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import Header from '@editorjs/header';
import RawTool from '@editorjs/raw';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import List from '@editorjs/list';
import AttachesTool from '@editorjs/attaches';
import FootnotesTune from '@editorjs/footnotes';

export default class TypesEditObjectModalComponent extends Component {
  @service store;
  @service router;
  @service types;

  @tracked objectModules = this.args.object ? this.args.object.modules : A([]);
  @tracked objectID = this.args.object ? this.args.object.modules.id : 'new';
  @tracked editorjsInstances = [];

  @action
  async pushObjects() {
    let vvv = this.objectModules;

    await this.args.selectedRowIDs[this.args.type.slug].forEach((id) => {
      this.store.findRecord(this.args.type.slug, id).then((obj) => {
        obj.modules = { ...vvv };
        obj.save();
      });
    });

    this.args.emptySelectedRowsInType(this.args.type.slug);
    this.args.loadTypeObjects(this.args.type);
    this.types.fetchAgain();
  }

  @action
  async deleteObjects() {
    await this.args.selectedRowIDs[this.args.type.slug].forEach((id) => {
      this.store.findRecord(this.args.type.slug, id).then(async (obj) => {
        await obj.destroyRecord();
      });
    });

    this.args.emptySelectedRowsInType(this.args.type.slug);
    this.types.fetchAgain();
  }

  @action
  async pushObject() {
    //save all modules that are type=editorjs in the object
    //because image data does no auto-save in component input-fields/editorjs

    let promises = [];
    this.args.type.modules.forEach((module) => {
      const promise = new Promise((resolve, reject) => {
        if (module.input_type !== 'editorjs') {
          resolve();
          return;
        }

        this.saveEditorData(module.input_slug, this.objectID).then(
          (outputData) => {
            this.mutObjectModuleValue(module.input_slug, outputData, false);
            resolve();
          }
        );
      });

      promises.push(promise);
    });

    await Promise.all(promises);

    const vvv = this.objectModules;
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
          console.info('saved store');
          document.querySelector('#close-' + this.args.object.id).click();
        });
    } else {
      let obj = await this.store.createRecord(this.args.type.slug, {
        modules: { ...vvv },
      });

      await obj.save();

      this.args.loadTypeObjects(this.args.type);
      this.objectModules = A([]);
      this.objectID = 'new';
      this.editorjsInstances = [];
    }

    this.types.fetchAgain();
  }

  @action
  async deleteObject() {
    if (
      this.args.object !== null &&
      this.args.object !== undefined &&
      this.args.object.id !== null
    ) {
      let obj = this.store.peekRecord(
        this.args.object.modules.type,
        this.args.object.modules.id
      );
      await obj.destroyRecord();
    }

    this.args.emptySelectedRowsInType(this.args.type.slug);
    this.types.fetchAgain();
  }

  @tracked deleteSurity = 'd-none';

  @action
  notSoSure() {
    this.deleteSurity = 'd-none';
    this.deleteSurity = this.deleteSurity;
  }

  @action
  areYouSure() {
    this.deleteSurity = 'd-flex';
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

      tools: {
        paragraph: {
          tunes: ['footnotes'],
        },
        header: {
          class: Header,
          config: {
            placeholder:
              editor_object_in_type.input_options !== undefined &&
              editor_object_in_type.input_options.header_placeholder !==
                undefined
                ? editor_object_in_type.input_options.header_placeholder
                : 'Enter a header',
            defaultLevel: 4,
          },
        },
        image: {
          class: ImageTool,
          config: {
            types: 'image/*, video/*',
            captionPlaceholder:
              editor_object_in_type.input_options !== undefined &&
              editor_object_in_type.input_options.image_caption_placeholder !==
                undefined
                ? editor_object_in_type.input_options.image_caption_placeholder
                : 'Caption',
            endpoints: {
              byFile: ENV.TribeENV.API_URL + '/uploads.php', // Your backend file uploader endpoint
              byUrl: ENV.TribeENV.API_URL + '/uploads.php', // Your endpoint that provides uploading by Url
            },
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            endpoint: ENV.TribeENV.API_URL + '/uploads.php',
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder:
              editor_object_in_type.input_options !== undefined &&
              editor_object_in_type.input_options.quote_caption_placeholder !==
                undefined
                ? editor_object_in_type.input_options.quote_caption_placeholder
                : "Quote's author",
          },
        },
        delimiter: Delimiter,
        Marker: {
          class: Marker,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        raw: {
          class: RawTool,
          config: {
            placeholder: 'Embed code or any HTML code',
          },
        },
        code: {
          class: CodeTool,
          config: {
            placeholder: 'Inline code for display within text',
          },
        },
        footnotes: {
          class: FootnotesTune,
          config: {
            placeholder: 'Footnotes',
          },
        },
      },
    });

    this.editorjsInstances = this.editorjsInstances;
  }

  @action
  async saveEditorData(module_input_slug, id) {
    const ejsId = `${this.args.type.slug}-${module_input_slug}-${id}`;

    if (!this.editorjsInstances[ejsId]) {
      console.error('editorJs save failed, editorjs instance not found');
      return;
    }

    const output = await this.editorjsInstances[ejsId].save().catch((error) => {
      console.log('Saving failed: ', error);
    });

    return output;
  }

  @action
  mutObjectModuleValue(module_input_slug, value, is_array = false, index = 0) {
    if (is_array == true) {
      if (index == 0 && !Array.isArray(this.objectModules[module_input_slug]))
        this.objectModules[module_input_slug] = [];
      this.objectModules[module_input_slug][index] = value.trim();
    } else {
      if (this.objectModules[module_input_slug] === undefined)
        this.objectModules[module_input_slug] = '';
      this.objectModules[module_input_slug] = value;
    }

    if (
      this.args.multiEdit === true &&
      Array.isArray(this.objectModules[module_input_slug]) &&
      this.objectModules[module_input_slug].length == 0
    ) {
      delete this.objectModules[module_input_slug];
    }

    this.objectModules = this.objectModules;
  }

  @action
  addToMultiField(module_input_slug, index = 0) {
    if (!Array.isArray(this.objectModules[module_input_slug]))
      this.objectModules[module_input_slug] = [
        this.objectModules[module_input_slug],
      ];

    if (
      this.objectModules[module_input_slug][index + 1] === undefined ||
      this.objectModules[module_input_slug][index + 1] == null
    )
      this.objectModules[module_input_slug][index + 1] = ' ';

    this.objectModules = this.objectModules;
  }

  @action
  removeFromMultiField(module_input_slug, index = 0) {
    delete this.objectModules[module_input_slug][index];
    if (this.objectModules[module_input_slug]) {
      this.objectModules[module_input_slug].filter((x) => x).join(', ');
    }
    this.objectModules = this.objectModules;
  }

  @action
  cleanVarsOnModalOpen(e) {
    const myModalEl = document.getElementById(e.id);
    myModalEl.addEventListener('show.bs.modal', (event) => {
      this.objectID = this.args.object ? this.args.object.modules.id : 'new';

      if (this.objectID === 'new') {
        this.objectModules = A([]);
        this.objectModules = this.objectModules;
      }
    });
  }
}
