import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class InputFieldsEditorjsComponent extends Component {
  @action
  saveEditorData() {
    this.args.editorjsInstances[
      this.args.type.slug +
        '-' +
        this.args.module['input_slug'] +
        '-' +
        this.args.id
    ]
      .save()
      .then((outputData) => {
        this.args.mutObjectModuleValue(
          this.args.module['input_slug'],
          outputData,
          false
        );
      })
      .catch((error) => {
        console.log('Saving failed: ', error);
      });
  }
}
