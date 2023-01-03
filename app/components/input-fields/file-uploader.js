import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import ENV from 'junction/config/environment';

export default class InputFieldsFileUploaderComponent extends Component {
  @service fileQueue;

  get queue() {
    return this.fileQueue.findOrCreate(
      this.args.type.slug + '-' + this.args.module.input_slug
    );
  }

  @action
  triggerSelectFile(e) {
    document.querySelector('#' + e).click();
  }

  @action
  async uploadFile(file) {
    try {
      const response = await file.upload(
        ENV.TribeENV.BASE_URL + '/uploads.php'
      );
      response.json().then((data) => {
        if (data.status == 'success') {
          console.log(data.file);
        } else if (data.status == 'error') {
          alert(data.error_message);
        }
      });
    } catch (error) {
      file.state = 'aborted';
    }
  }
}
