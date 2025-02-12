import Component from '@glimmer/component';
import hljs from 'highlight.js';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApiCodeReference extends Component {
	@action
	highlightAll() {
		hljs.highlightAll();
	}
}
