import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { later } from '@ember/runloop';
import { Modal } from 'bootstrap';

export default class InputFieldsEditorjsComponent extends Component {
  @service object;
  @service type;
}
