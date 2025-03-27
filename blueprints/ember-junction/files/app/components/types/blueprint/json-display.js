import Component from '@glimmer/component';
import { prettyPrintJson, FormatOptions } from 'pretty-print-json';

export default class TypesBlueprintJsonDisplayComponent extends Component {
  prettify = (data) => {
    if (data !== undefined && data !== null) {
      var newdata = {};
      newdata.type = data.type;
      newdata.id = data.id;
      newdata.slug = data.slug;
      newdata.modules = data;
    }

    return prettyPrintJson.toHtml(newdata, {
      quoteKeys: true,
      trailingCommas: false,
    });
  };
}
