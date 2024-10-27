import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';

export default class BillingService extends Service {
  @tracked currentJunction = null;
  @tracked junctionSlug = '';
  @tracked tribeLink = '';
  @tracked pendingAmount;

  @action
  async fetchLatestTypes() {
    if (this.tribeLink) {
      let types_json = await fetch(this.tribeLink).then((response) => {
        return response.json();
      });
      this.name = types_json['webapp']['name'];
      this.slug = this.junctionSlug;
      this.totalObjects = types_json['webapp']['total_objects'];
      this.sizeinGB = types_json['webapp']['size_in_gb'];
    }
  }

  get whichPlan() {
    return 'S1';
  }

  get isPaymentDue() {
    return true;
  }

  get monthlyInvoices() {
    return null;
  }
}
