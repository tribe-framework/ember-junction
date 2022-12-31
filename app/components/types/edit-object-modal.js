import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import fetch from 'fetch';

export default class TypesEditObjectModalComponent extends Component {
	@service store;

	@tracked object = this.args.object;
	@tracked objectModules = this.args.object ? this.args.object.modules : {};

	@action
	saveObject() {
		/*let response = await fetch('https://do7.wildfire.world/api.php/'+this.args.type.slug, {
			  method: 'POST',
			  headers: {
			    'Content-Type': 'application/json;charset=utf-8'
			  },
			  body: JSON.stringify(this.object)
			})
	      .then(function(response) {
	        if (response.ok) {
	          	return response.json();
	        }
	      });
		
		let v = this.store.findRecord(this.args.type.slug, response.id);	
	    this.store.push({data: [v]});*/

		//console.log(this.args.type.slug);
		let obj = this.store.createRecord(this.args.type.slug, {modules: this.objectModules});
		//obj.save();
	}
}
