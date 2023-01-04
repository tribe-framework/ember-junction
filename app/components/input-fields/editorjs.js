import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import EditorJS from '@editorjs/editorjs';

export default class InputFieldsEditorjsComponent extends Component {
  @action
  initEditor() {
    const editor = new EditorJS('editorjs');
  }
}
