import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { A } from '@ember/array';
import { Modal } from 'bootstrap';

export default class InputFieldsSelectComponent extends Component {
  @service store;
  @service types;

  @tracked options = A([]);
  @tracked inputOptions = this.args.module.input_options ?? null;
  @tracked typeOptions = null;
  @tracked selectedOption = null;
  @tracked selectedMultiOptions = A([]);
  @tracked moduleisAlsoAType = false;
  @tracked selectedMultiOptionSlugs = A([]);
  @tracked titleSlug = 'title';

  @action
  async cleanVarsOnNewModalOpen() {
    const myModalNew = document.getElementById('editObjectModal');
    await myModalNew.addEventListener('show.bs.modal', async (event) => {
      this.selectedOption = null;
      this.selectedMultiOptions = A([]);

      this.selectedOption = this.selectedOption;
      this.selectedMultiOptions = this.selectedMultiOptions;

      await this.isModuleAlsoAType();
    });
  }

  @action
  async cleanVarsOnMultiModalOpen() {
    const myModalMulti = document.getElementById(
      'editObjectModal-' + this.args.type.slug + '-multi',
    );
    await myModalMulti.addEventListener('show.bs.modal', async (event) => {
      this.selectedOption = null;
      this.selectedMultiOptions = A([]);

      this.selectedOption = this.selectedOption;
      this.selectedMultiOptions = this.selectedMultiOptions;

      await this.isModuleAlsoAType();
    });
  }

  @action
  updateValue(e) {
    if (e === null) {
      this.selectedOption = e;
      this.args.mutObjectModuleValue(this.args.module.input_slug, null, false);

      return;
    }
    this.selectedOption = e;
    this.args.mutObjectModuleValue(this.args.module.input_slug, e.slug, false);
  }

  @action
  updateMultiValue(e) {
    this.selectedMultiOptions = A([]);
    this.selectedMultiOptionSlugs = A([]);
    this.selectedMultiOptions = this.selectedMultiOptions;

    e.forEach((f) => {
      this.options.forEach((element) => {
        if (element.slug == f.slug) {
          this.selectedMultiOptions.push(f);
        }
      });

      if (this.selectedMultiOptionSlugs.indexOf(f.slug) === -1)
        this.selectedMultiOptionSlugs.push(f.slug);
    });

    this.selectedMultiOptions = this.selectedMultiOptions;
    this.selectedMultiOptionSlugs = this.selectedMultiOptionSlugs;

    this.args.mutObjectModuleValue(
      this.args.module.input_slug,
      this.selectedMultiOptionSlugs,
      false,
    );
  }

  @action
  isModuleAlsoATypeModal() {
    const myModalNew = document.getElementById('editObjectModal');
    myModalNew.addEventListener('show.bs.modal', async (event) => {
      await this.isModuleAlsoAType();
    });
  }

  @action
  async isModuleAlsoAType() {
    if (
      this.types.json.modules[this.args.module.input_slug] !== undefined ||
      this.types.json.modules[this.args.module.linked_type] !== undefined
    ) {
      if (this.types.json.modules[this.args.module.input_slug] !== undefined)
        var linked_type = this.args.module.input_slug;
      else if (
        this.types.json.modules[this.args.module.linked_type] !== undefined
      )
        var linked_type = this.args.module.linked_type;

      this.types.json.modules[linked_type].modules.forEach(async (m) => {
        if (m.input_primary !== undefined && m.input_primary !== false)
          this.titleSlug = await m.input_slug;
      });

      this.typeOptions = await this.store.peekAll(linked_type);
      this.options = [];

      this.typeOptions.forEach((element) => {
        this.options.push(element.modules);

        if (
          typeof this.args.object[this.args.module.input_slug] !== 'undefined'
        ) {
          //selected option
          if (
            typeof this.args.object[this.args.module.input_slug] === 'string' &&
            element.modules.slug ==
              this.args.object[this.args.module.input_slug]
          ) {
            this.selectedOption = element.modules;
            this.selectedMultiOptions[0] = element.modules;
          }

          //part of selected multi options
          if (
            typeof this.args.object[this.args.module.input_slug] !== 'string' &&
            inArray(
              element.modules.slug,
              this.args.object[this.args.module.input_slug],
            )
          ) {
            this.selectedOption = element.modules;
            this.selectedMultiOptions.push(element.modules);
          }
        }
      });
    } else if (this.inputOptions !== null) {
      this.options = [];

      this.inputOptions.forEach((element) => {
        this.options.push(element);

        if (
          typeof this.args.object[this.args.module.input_slug] !== 'undefined'
        ) {
          //selected option
          if (
            typeof this.args.object[this.args.module.input_slug] === 'string' &&
            element.slug == this.args.object[this.args.module.input_slug]
          ) {
            this.selectedOption = element;
            this.selectedMultiOptions[0] = element;
          }

          //part of selected multi options
          if (
            typeof this.args.object[this.args.module.input_slug] !== 'string' &&
            inArray(element.slug, this.args.object[this.args.module.input_slug])
          ) {
            this.selectedOption = element;
            this.selectedMultiOptions.push(element);
          }
        }
      });
    }

    this.options = this.options;
    this.selectedMultiOptions = this.selectedMultiOptions;

    function inArray(needle, haystack) {
      if (haystack !== null) {
        var length = haystack.length;
        for (var i = 0; i < length; i++) {
          if (haystack[i] == needle) return true;
        }
      }
      return false;
    }
  }
}
