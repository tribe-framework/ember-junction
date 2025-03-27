import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Papa from 'papaparse';

export default class FilesCsvUploader extends Component {
  @service store;
  @service colormodes;
  @service type;

  @tracked isProcessing = false;
  @tracked processingProgress = 0;
  @tracked processingErrors = [];
  @tracked headers = [];
  @tracked rowCount = 0;

  @action
  triggerSelectFile(e) {
    document.querySelector('#' + e).click();
  }

  @action
  async processFile(file) {
    this.isProcessing = true;
    this.processingProgress = 0;
    this.processingErrors = [];
    this.rowCount = 0;

    try {
      // Read the file as text first
      const reader = new FileReader();

      reader.onload = (event) => {
        const csvText = event.target.result;

        // Now parse the CSV text with PapaParse
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true,
          complete: (results) => {
            if (results) {
              this.type.csvData = results.data;
              this.headers = results.meta.fields || [];
              this.rowCount = results.data.length;
              this.processingErrors = results.errors || [];

              if (this.args.onCsvProcessed) {
                this.args.onCsvProcessed({
                  data: this.type.csvData,
                  headers: this.headers,
                  rowCount: this.rowCount,
                  errors: this.processingErrors,
                });
              }
            } else {
              this.processingErrors.push({
                message: 'Failed to process CSV: Results object is undefined',
              });
            }

            this.processingProgress = 100;
            this.isProcessing = false;
          },
          error: (error) => {
            this.processingErrors.push(error);
            this.isProcessing = false;
          },
        });
      };

      reader.onerror = (error) => {
        this.processingErrors.push({
          message: 'Error reading file: ' + error,
        });
        this.isProcessing = false;
      };

      // Start reading the file
      reader.readAsText(file);
    } catch (error) {
      this.processingErrors.push({
        message: 'Exception while processing file: ' + error.message,
      });
      this.isProcessing = false;
    }
  }

  @action
  handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  @action
  handleFileDrop(event) {
    const files = event.detail;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }
}
