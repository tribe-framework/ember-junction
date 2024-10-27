import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesModulesInputOptionComponent extends Component {
  @service module;

  @tracked clickedOutside = true;

  convertToSlug = (Text) => {
    return Text.toLowerCase()
      .replace(/ /g, '_')
      .replace(/[^\w-]+/g, '')
      .replace(/-/g, '_');
  };

  @tracked option =
    this.args.option !== undefined ? this.args.option : { title: '', slug: '' };

  @action
  validateOption(e) {
    if (this.clickedOutside === false) {
      this.clickedOutside = true;
      if (this.option.title || this.option.slug) {
        if (!this.option.slug) {
          this.option.slug = this.convertToSlug(this.option.title);
        }
        if (!this.option.title) {
          this.option.title = this.option.slug;
        }
        this.option = this.option;

        this.module.updateOption(this.option);
      }
    }
  }

  @action
  clickedInside() {
    this.clickedOutside = false;
  }
}
