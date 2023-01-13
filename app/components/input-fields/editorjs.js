import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import EditorJS from '@editorjs/editorjs';

export default class InputFieldsEditorjsComponent extends Component {
  @tracked editor;

  @action
  initEditor() {
    this.editor = new EditorJS({
      holder: this.args.type.slug+'-'+this.args.module.input_slug+'-'+this.args.id,
      data: this.args.object[this.args.module.input_slug],
      placeholder: this.args.module.input_placeholder
    });
  }
}
