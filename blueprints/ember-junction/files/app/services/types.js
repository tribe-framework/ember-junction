import Service from '@ember/service';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Model, { attr } from '@ember-data/model';
import { getOwner } from '@ember/application';

export default class TypesService extends Service {
  @service store;
  @tracked json = this.store.peekRecord('webapp', 0, {
    include: ['total_objects'],
  });

  @action
  async fetchAgain() {
    if (ENV.TribeENV.API_URL !== undefined && ENV.TribeENV.API_URL != '') {
      this.json = await this.store.findRecord('webapp', 0, {});
      let owner = getOwner(this);

      Object.entries(this.json.modules).forEach(([modelName, modelData]) => {
        const modelDynamicName = modelName.replace(/_/g, '-');

        class DynamicModel extends Model {
          @attr slug;
          @attr modules;
        }
        
        if (!owner.hasRegistration(`model:${modelDynamicName}`)) {
          owner.register(`model:${modelDynamicName}`, DynamicModel);
        }
      });
      
      this.json = await this.store.findRecord('webapp', 0, {
        include: ['total_objects'],
      });
      this.json = this.json;
      this.simplifiedJson = this.convertTypesToSimplified(this.json);
    }
  }
  
  convertTypesToSimplified = (typesJson)=>{
    // Create the basic structure with a types object
    const simplifiedTypes = {
      types: {}
    };

    // Iterate through each content type in the original file
    for (const [typeSlug, typeData] of Object.entries(typesJson.modules)) {
      // Skip the webapp info and any types without modules
      if (typeSlug === 'webapp' || typeSlug === 'deleted_record' || typeSlug === 'blueprint_record' || typeSlug === 'file_record' || typeSlug === 'apikey_record' || !typeData.modules || !Array.isArray(typeData.modules)) {
        continue;
      }

      // Create a new object for this type
      simplifiedTypes.types[typeSlug] = {};

      // Process each module in the content type
      typeData.modules.forEach(module => {
        const slug = module.input_slug;
        let varType = module.var_type;

        // Handle select options if they exist
        if (module.input_options && Array.isArray(module.input_options) && module.input_options.length > 0) {
          // Extract all option slugs
          const optionSlugs = module.input_options.map(option => option.slug);
          
          // Add the piped extension to the var_type
          if (optionSlugs.length > 0) {
            varType += ` | ${optionSlugs.join(', ')}`;
          }
        }

        // Add the module to the simplified type
        simplifiedTypes.types[typeSlug][slug] = varType;
      });
    }

    return simplifiedTypes;
  }
}
