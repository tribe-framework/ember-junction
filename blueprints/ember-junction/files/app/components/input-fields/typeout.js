import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';

export default class InputFieldsTypeoutComponent extends Component {
  @tracked t = null;
  @tracked disabled = true;

  @action
  initTypeout() {
    this.disabled = false;
    this.t = null;

    later(
      this,
      () => {
        this.t = tinymce.init({
          selector:
            'textarea#' +
            this.args.type.slug +
            '-' +
            this.args.module.input_slug +
            '-' +
            this.args.id,
          plugins: 'advlist link image lists',
          license_key: 'gpl',
        });
        this.t = this.t;
      },
      300,
    );
  }

  @action
  saveTypeout() {
    this.args.mutObjectModuleValue(
      this.args.module.input_slug,
      tinymce
        .get(
          this.args.type.slug +
            '-' +
            this.args.module.input_slug +
            '-' +
            this.args.id,
        )
        .getContent(),
    );

    later(
      this,
      () => {
        this.disabled = true;
      },
      300,
    );
  }
}
