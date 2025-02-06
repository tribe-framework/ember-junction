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
import Table from '@editorjs/table';
import Hyperlink from 'editorjs-hyperlink';
import fetch from 'fetch';
import { Modal } from 'bootstrap';
import { modifier } from 'ember-modifier';

export default class TypesEditObjectModalComponent extends Component {
  @service store;
  @service router;
  @service types;
  @service type;
  @service colormodes;
  @service object;

  indexOf = (arr, slug) => {
    let publicModules = JSON.parse(arr);
    if (publicModules[slug] !== undefined && publicModules[slug] !== false)
      return true;
    else return false;
  };

  @tracked objectModules = this.object.currentObject
    ? this.object.currentObject.modules
    : A([]);
  @tracked objectID = this.object.currentObject
    ? this.object.currentObject.modules.id
    : 'new';
  @tracked editorjsInstances = [];
  @tracked doUpdateSlug = false;

  onload = modifier((el) => {
    el.addEventListener('show.bs.modal', this.cleanVarsOnModalOpen(el));
  });

  @action
  async pushObjects() {
    let vvv = this.objectModules;

    await this.type.selectedRowIDs[this.type.currentType.slug].forEach((id) => {
      this.store.findRecord(this.type.currentType.slug, id).then((obj) => {
        obj.modules = { ...vvv };
        obj.save();

        if (
          this.type.currentType.api_hooks !== undefined &&
          this.type.currentType.api_hooks.on_update !== undefined &&
          this.type.currentType.api_hooks.on_update != ''
        ) {
          fetch(this.type.currentType.api_hooks.on_update, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: obj.id }),
          });
        }
      });
    });

    this.type.emptySelectedRowsInType(this.type.currentType.slug);
    this.type.loadTypeObjects(this.type.currentType);
    this.types.fetchAgain();
  }

  @action
  async deleteObjects() {
    await this.type.selectedRowIDs[this.type.currentType.slug].forEach((id) => {
      this.store
        .findRecord(this.type.currentType.slug, id)
        .then(async (obj) => {
          await obj.destroyRecord();

          if (
            this.type.currentType.api_hooks !== undefined &&
            this.type.currentType.api_hooks.on_delete !== undefined &&
            this.type.currentType.api_hooks.on_delete != '' &&
            id !== undefined
          ) {
            fetch(this.type.currentType.api_hooks.on_delete, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id: id }),
            });
          }
        });
    });

    this.type.emptySelectedRowsInType(this.type.currentType.slug);
    this.types.fetchAgain();
  }

  @action
  async pushObject(e) {
    if (e !== undefined) {
      this.colormodes.buttonLoading(e);
    }
    //save all modules that are type=editorjs in the object
    //because image data does no auto-save in component input-fields/editorjs

    let promises = [];
    this.type.currentType.modules.forEach((module) => {
      const promise = new Promise((resolve, reject) => {
        if (
          module.input_type == 'editorjs' ||
          ((module.input_type == 'text' ||
            module.input_type == 'textarea' ||
            module.input_type == 'color' ||
            module.input_type == 'date' ||
            module.input_type == 'datetime-local' ||
            module.input_type == 'email' ||
            module.input_type == 'url') &&
            module.input_multiple === true)
        ) {
          if (module.input_type == 'editorjs') {
            this.saveEditorData(module.input_slug, this.objectID).then(
              (outputData) => {
                this.mutObjectModuleValue(module.input_slug, outputData, false);
                resolve();
                var ejsTarget = `${this.type.currentType.slug}-${module.input_slug}`;
                if (
                  this.editorjsInstances != [] &&
                  this.editorjsInstances[ejsTarget] !== undefined
                )
                  this.editorjsInstances[ejsTarget].destroy();
              },
            );
          } else {
            const mtxtId = `${this.type.currentType.slug}-${module.input_slug}-${this.objectID}`;
            const inputs = document.querySelectorAll(
              "[name='" + mtxtId + "[]']",
            );
            let j = 0;
            for (let i = 0; i < inputs.length; i++) {
              if (inputs[i].value.trim() != '') {
                this.mutObjectModuleValue(
                  module.input_slug,
                  inputs[i].value,
                  true,
                  j,
                );
                j++;
              }
            }
            resolve();
          }
        } else {
          resolve();
          return;
        }
      });

      promises.push(promise);
    });

    await Promise.all(promises);

    const vvv = this.objectModules;

    delete vvv.slug_update;

    if (this.doUpdateSlug == true) {
      vvv.slug_update = true;
      this.doUpdateSlug = false;
    }

    if (this.object.viaPublicForm === true && !vvv.content_privacy) {
      vvv.content_privacy = 'private';
    }

    //if mandatory fields have not been filled
    let stop = false;
    if (
      !this.type.currentType.sendable &&
      vvv.content_privacy !== undefined &&
      !(vvv.content_privacy == '' || vvv.content_privacy == 'draft')
    ) {
      this.type.currentType.modules.forEach((module) => {
        if (module.input_required === true) {
          let slg = module.input_slug;
          if (!vvv[slg]) {
            stop = true;
          }
        }
      });
    }

    if (stop === true) {
      alert('Please fill all mandatory fields.');

      if (e !== undefined) {
        this.colormodes.buttonUnloading(e);
      }
    } else {
      if (
        this.object.currentObject !== null &&
        this.object.currentObject !== undefined &&
        this.object.currentObject.id !== null
      ) {
        this.store
          .findRecord(
            this.object.currentObject.modules.type,
            this.object.currentObject.modules.id,
          )
          .then((obj) => {
            obj.modules = vvv;

            obj.save();

            if (
              this.type.currentType.api_hooks !== undefined &&
              this.type.currentType.api_hooks.on_update !== undefined &&
              this.type.currentType.api_hooks.on_update != '' &&
              obj.id !== undefined
            ) {
              fetch(this.type.currentType.api_hooks.on_update, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: obj.id }),
              });
            }

            let editModal = Modal.getOrCreateInstance('#editObjectModal');
            editModal.hide();
          });
      } else {
        let obj = await this.store.createRecord(this.type.currentType.slug, {
          modules: { ...vvv },
        });

        await obj.save();

        if (
          this.type.currentType.api_hooks !== undefined &&
          this.type.currentType.api_hooks.on_create !== undefined &&
          this.type.currentType.api_hooks.on_create != '' &&
          obj.id !== undefined
        ) {
          fetch(this.type.currentType.api_hooks.on_create, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: obj.id }),
          });
        }

        this.type.loadTypeObjects(this.type.currentType);
        this.objectID = 'new';
        this.cleanVarsIfNew();
        this.object.currentObject = obj;

        let editModal = Modal.getOrCreateInstance('#editObjectModal');
        editModal.hide();
      }

      this.types.fetchAgain();

      if (e !== undefined) {
        this.colormodes.buttonUnloading(e);
      }
    }
  }

  @action
  async deleteObject() {
    if (
      this.object.currentObject !== null &&
      this.object.currentObject !== undefined &&
      this.object.currentObject.id !== null
    ) {
      let obj = this.store.peekRecord(
        this.object.currentObject.modules.type,
        this.object.currentObject.modules.id,
      );
      var id = this.object.currentObject.modules.id;
      await obj.destroyRecord();

      if (
        this.type.currentType.api_hooks !== undefined &&
        this.type.currentType.api_hooks.on_delete !== undefined &&
        this.type.currentType.api_hooks.on_delete != '' &&
        id !== undefined
      ) {
        fetch(this.type.currentType.api_hooks.on_delete, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }),
        });
      }
    }

    this.type.emptySelectedRowsInType(this.type.currentType.slug);
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
  async uninitEditorJS(module_input_slug) {
    const ejsTarget = `${this.type.currentType.slug}-${module_input_slug}`;
    if (
      this.editorjsInstances != [] &&
      this.editorjsInstances[ejsTarget] !== undefined &&
      this.editorjsInstances[ejsTarget].blocks !== undefined
    ) {
      this.editorjsInstances[ejsTarget].destroy();
    }
  }

  @action
  async initEditorJS(module_input_slug) {
    const ejsTarget = `${this.type.currentType.slug}-${module_input_slug}`;

    if (
      this.objectID == 'new' &&
      this.editorjsInstances != [] &&
      this.editorjsInstances[ejsTarget] !== undefined
    )
      this.editorjsInstances[ejsTarget].destroy();

    var editor_object_in_type = Object(this.type.currentType.modules).find(
      function (element) {
        if (element['input_slug'] == module_input_slug) return element;
      },
    );

    let primaryPlaceholder =
      editor_object_in_type !== undefined &&
      editor_object_in_type.input_placeholder !== undefined
        ? editor_object_in_type.input_placeholder
        : 'Type here...';

    var ejsInstance = new EditorJS({
      holder: ejsTarget,
      data: this.object.currentObject
        ? this.object.currentObject.modules[module_input_slug]
        : {},
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
        hyperlink: Hyperlink,
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
        table: Table,
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

    ejsInstance.isReady
      .then((i) => {
        const editors = document.querySelectorAll(
          `#editObjectModal .codex-editor`,
        );
        const editorsCount = editors.length;

        this.editorjsInstances[ejsTarget] = ejsInstance;

        if (this.objectID == 'new')
          this.editorjsInstances[ejsTarget].blocks.clear();
      })
      .catch((e) => {
        console.error('Error during Editor.js initialization:', e);
      });
  }

  @action
  async saveEditorData(module_input_slug, id) {
    var ejsId = `${this.type.currentType.slug}-${module_input_slug}`;

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
    if (this.objectModules[module_input_slug] === undefined)
      this.objectModules[module_input_slug] = [];

    this.objectModules[module_input_slug].push('');
    this.objectModules = this.objectModules;
  }

  @action
  removeFromMultiField(module_input_slug, index = 0) {
    this.objectModules[module_input_slug].splice(index, 1);
    this.objectModules = this.objectModules;
  }

  @action
  cleanVarsIfNew() {
    this.objectModules = A([]);
    this.objectModules = this.objectModules;
    this.editorjsInstances = [];
  }

  @action
  cleanVarsOnModalOpen(e) {
    const myModalEl = document.getElementById(e.id);
    myModalEl.addEventListener('show.bs.modal', (event) => {
      this.deleteSurity = 'd-none';

      this.objectID = this.object.currentObject
        ? this.object.currentObject.modules.id
        : 'new';
      this.objectModules = this.object.currentObject
        ? this.object.currentObject.modules
        : A([]);

      if (this.objectID == 'new' || this.objectID == 'multi') {
        this.cleanVarsIfNew();
      }
    });
  }

  @action
  updateSlug() {
    if (
      confirm(
        'Are you sure you wish to update the slug? It will impact all linked objects.',
      ) == true
    ) {
      this.doUpdateSlug = true;
    } else {
      this.doUpdateSlug = false;
    }
  }
}
