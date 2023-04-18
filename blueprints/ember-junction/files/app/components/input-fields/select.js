import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { A } from '@ember/array';

export default class InputFieldsSelectComponent extends Component {
  @service store;

  @tracked options = A([]);
  @tracked inputOptions = this.args.module.input_options ?? null;
  @tracked typeOptions = null;
  @tracked selectedOption = null;
  @tracked selectedMultiOptions = A([]);
  @tracked moduleisAlsoAType = false;
  @tracked selectedMultiOptionSlugs = A([]);

  @action
  updateValue(e) {
    this.selectedOption = e;

    this.args.mutObjectModuleValue(this.args.module.input_slug, e.slug, false);
  }

  @action
  updateMultiValue(e) {
    this.selectedMultiOptions = [];
    this.selectedMultiOptionSlugs = [];
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
      false
    );
  }

  @action
  async isModuleAlsoAType() {
    if (
      this.args.webapp.modules[this.args.module.input_slug] !== undefined
    ) {
      this.typeOptions = await this.store.peekAll(
        this.args.module.input_slug
      );

      this.typeOptions.forEach((element) => {
        this.options.push(element.modules);

        if (
          typeof this.args.object[this.args.module.input_slug] !== 'undefined'
        ) {
          //selected option
          if (
            typeof this.args.object[this.args.module.input_slug] ===
              'string' &&
            element.modules.slug ==
              this.args.object[this.args.module.input_slug]
          ) {
            this.selectedOption = element.modules;
            this.selectedMultiOptions[0] = element.modules;
          }

          //part of selected multi options
          if (
            typeof this.args.object[this.args.module.input_slug] !==
              'string' &&
            inArray(
              element.modules.slug,
              this.args.object[this.args.module.input_slug]
            )
          ) {
            this.selectedOption = element.modules;
            this.selectedMultiOptions.push(element.modules);
          }
        }
      });
    }

    else if (this.inputOptions !== null) {
      this.inputOptions.forEach((element) => {
        this.options.push(element);

        if (
          typeof this.args.object[this.args.module.input_slug] !== 'undefined'
        ) {
          //selected option
          if (
            typeof this.args.object[this.args.module.input_slug] ===
              'string' &&
            element.slug == this.args.object[this.args.module.input_slug]
          ) {
            this.selectedOption = element;
            this.selectedMultiOptions[0] = element;
          }

          //part of selected multi options
          if (
            typeof this.args.object[this.args.module.input_slug] !==
              'string' &&
            inArray(
              element.slug,
              this.args.object[this.args.module.input_slug]
            )
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
      var length = haystack.length;
      for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
      }
      return false;
    }
  }
}
