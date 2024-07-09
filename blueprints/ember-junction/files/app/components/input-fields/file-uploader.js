import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { Queue } from 'ember-file-upload';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { later } from '@ember/runloop';

export default class InputFieldsFileUploaderComponent extends Component {
  isString = (object) => {
    return typeof object === 'string' ? true : false;
  };

  explodeFilename = (filename) => {
    var myarr = filename.split('/uploads/');
    return myarr[1];
  };

  @service fileQueue;
  @service store;
  @service colormodes;

  get queue() {
    return this.fileQueue.findOrCreate(
      this.args.type.slug +
        '-' +
        this.args.module.input_slug +
        '-' +
        this.args.id,
    );
  }

  @action
  triggerSelectFile(e) {
    document.querySelector('#' + e).click();
  }

  @action
  async uploadFile(file) {
    try {
      const response = await file.upload(ENV.TribeENV.API_URL + '/uploads.php');
      response.json().then(async (data) => {
        if (data.status == 'success') {
          let files = this.args.object[this.args.module.input_slug] ?? [];
          files.push(data.file);
          this.args.mutObjectModuleValue(this.args.module.input_slug, files);

          let obj = this.store.createRecord('file_record', {
            modules: {
              title: data.file.name,
              mime: data.file.mime,
              url: data.file.url,
              file: data.file,
              content_privacy: 'private',
            },
          });
          await obj.save();
        } else if (data.status == 'error') {
          alert(data.error_message);
        }
      });
    } catch (error) {
      file.state = 'aborted';
    }
  }

  @action
  deleteFile(index) {
    let files = this.args.object[this.args.module.input_slug] ?? [];
    if (index > -1) {
      files.splice(index, 1);
    }
    this.args.mutObjectModuleValue(this.args.module.input_slug, files);
  }

  @action
  copyLink(text, index) {
    document.querySelector('#copy-' + index).innerHTML = 'Copied!';

    navigator.clipboard.writeText(text);

    later(
      this,
      () => {
        document.querySelector('#copy-' + index).innerHTML = 'Copy link';
      },
      2000,
    );
  }
}
