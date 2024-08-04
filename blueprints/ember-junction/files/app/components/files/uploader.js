import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { Queue } from 'ember-file-upload';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { later } from '@ember/runloop';

export default class FilesUploaderComponent extends Component {
  @service fileQueue;
  @service store;
  @service colormodes;

  explodeFilename = (filename) => {
    var base = new String(filename).substring(filename.lastIndexOf('/') + 1);
    if (base.lastIndexOf('.') != -1)
      base = base.substring(0, base.lastIndexOf('.'));
    return base;
  };

  get queue() {
    return this.fileQueue.findOrCreate('main-files-uploader');
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

          if (this.args.updateOnUpload !== undefined)
            this.args.updateOnUpload(data.file);
          else this.args.reload();
        } else if (data.status == 'error') {
          alert(data.error_message);
        }
      });
    } catch (error) {
      file.state = 'aborted';
    }
  }
}
