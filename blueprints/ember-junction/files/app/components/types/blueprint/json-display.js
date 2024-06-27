import Component from '@glimmer/component';
import { prettyPrintJson, FormatOptions } from 'pretty-print-json';

export default class TypesBlueprintJsonDisplayComponent extends Component {
  prettify = (data) => {
    return prettyPrintJson.toHtml(data, {
      quoteKeys: true,
      trailingCommas: false,
    });
  };
}
