import Model, { attr } from '@ember-data/model';

export default class ArticleModel extends Model {
	@attr('tribe-modules') modules;
}
