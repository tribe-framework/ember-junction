import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class TypesListTablePaginationComponent extends Component {
	@tracked pageLength = 5;
	@tracked numberOfPages = Math.ceil(Number(this.args.type.total_objects) / this.pageLength);

	get pageLinks() {
		let i = 1;
		let pages = [];
		while (i <= this.numberOfPages) {
		  pages.push(i);
		  i++;
		}
		console.log(pages);
		return pages;
	}
}
