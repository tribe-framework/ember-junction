import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { Modal } from 'bootstrap';
import { modifier } from 'ember-modifier';

export default class InputFieldsEditorjsComponent extends Component {
  @service object;
  @service type;

  onload = modifier((input_slug) => {
    // initialize EditorJS when BS Modal is displayed
    this.type.editObjectModal.addEventListener('show.bs.modal', () => {
      this.type.showModalEvents.push(
        this.args.initEditorJS(input_slug)
      );
    });

    // remove EditorJS when BS Modal is hidden
    this.type.editObjectModal.addEventListener('hidden.bs.modal', () => {
      this.type.hideModalEvents.push(
        this.args.uninitEditorJS(input_slug)
      );
    });
  });
}
