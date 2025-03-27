import Component from '@glimmer/component';
import hljs from 'highlight.js';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import ENV from '<%= dasherizedPackageName %>/config/environment';

export default class ApiAuthReference extends Component {
  @service session;
  @service colormodes;
  @service store;

  @tracked apiUrl;
  @tracked copiedUrl = false;
  @tracked copiedWebappUrl = false;
  @tracked copiedJs = false;
  @tracked copiedCurl = false;

  constructor() {
    super(...arguments);
    this.setApiUrl();
  }

  get javascriptSnippet() {
    return `// Using fetch to access your Junction API
const response = await fetch('${this.apiUrl}/api.php/webapp/0', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);`;
  }

  get curlSnippet() {
    return `curl -X GET \\
  '${this.apiUrl}/api.php/webapp/0' \\
  -H 'Content-Type: application/json'`;
  }

  setApiUrl() {
    this.apiUrl = ENV.TribeENV.API_URL;
  }

  @action
  async copyApiWebappUrl() {
    try {
      await navigator.clipboard.writeText(this.apiUrl + '/api.php/webapp/0');
      this.copiedWebappUrl = true;

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.copiedWebappUrl = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  @action
  async copyApiUrl() {
    try {
      await navigator.clipboard.writeText(this.apiUrl);
      this.copiedUrl = true;

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.copiedUrl = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  @action
  async copyJsSnippet() {
    try {
      await navigator.clipboard.writeText(this.javascriptSnippet);
      this.copiedJs = true;

      setTimeout(() => {
        this.copiedJs = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  @action
  async copyCurlSnippet() {
    try {
      await navigator.clipboard.writeText(this.curlSnippet);
      this.copiedCurl = true;

      setTimeout(() => {
        this.copiedCurl = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
}
