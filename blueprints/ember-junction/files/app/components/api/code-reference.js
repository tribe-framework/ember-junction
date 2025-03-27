import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ApiCodeReference extends Component {
  @service type;
  @service colormodes;

  @tracked copiedJs = false;
  @tracked copiedCurl = false;
  @tracked copiedUrl = false;

  @action
  async copyApiUrl() {
    try {
      await navigator.clipboard.writeText(this.type.apiUrl);
      this.copiedUrl = true;

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.copiedUrl = false;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

  get javascriptSnippet() {
    return `
// Example of fetching data from your Junction API
const fetchJunctionData = async () => {
  const response = await fetch('${this.type.apiUrl}', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return await response.json();
};

// Usage example
try {
  const data = await fetchJunctionData();
  console.log('Junction data:', data);
} catch (error) {
  console.error('Error fetching junction data:', error);
}`;
  }

  get curlSnippet() {
    return `
# Basic GET request to fetch junction data
curl -X GET \\
  '${this.type.apiUrl}' \\
  -H 'Content-Type: application/json'

# POST request to create data
curl -X POST \\
  '${this.type.apiUrl}' \\
  -H 'Content-Type: application/json' \\
  -d '{
    modules: {
      "title": "Example Data",
      "content_privacy": "public"
    }
  }'`;
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
