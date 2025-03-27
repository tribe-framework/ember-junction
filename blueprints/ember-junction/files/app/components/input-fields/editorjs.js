import Component from '@glimmer/component';
import { service } from '@ember/service';
import { modifier } from 'ember-modifier';
import ENV from '<%= dasherizedPackageName %>/config/environment';
import EditorJS from '@editorjs/editorjs';
import ImageTool from '@editorjs/image';
import Header from '@editorjs/header';
import RawTool from '@editorjs/raw';
import CodeTool from '@editorjs/code';
import Marker from '@editorjs/marker';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import List from '@editorjs/list';
import AttachesTool from '@editorjs/attaches';
import FootnotesTune from '@editorjs/footnotes';
import Table from '@editorjs/table';
import Hyperlink from 'editorjs-hyperlink';

export default class InputFieldsEditorjsComponent extends Component {
  @service object;
  @service type;

  // TODO: editorjs service is likely an overkill for this, explore alternatives
  // this service was chosen to make the ejsInstance available to the parent,
  // if there's a better way to do it, it should take precendene
  @service editorjs;

  onload = modifier((input_slug) => {
    const ejsTarget = `${this.type.currentType.slug}-${input_slug}`;
    const ejsInstance = this.editorjs.instances[ejsTarget];

    // editorjs instance in DOM
    let codex = document.querySelector(`#${ejsTarget} > .codex-editor`);

    // this check is being done to make sure multiple instances are not spawned
    if (!codex) {
      this.unloadEditorJS(ejsTarget);
      this.loadEditorJS(input_slug, ejsTarget);
      return;
    }

    // spawn a new instance if none exist
    if (!ejsInstance) {
      this.loadEditorJS(input_slug, ejsTarget);
      return;
    }

    // if an old object is being edited and the has valid editorjs data
    let ejsData = this.object.currentObject
      ? this.object.currentObject.modules[input_slug]
      : null;

    // if a new object is being created or if ejsOptions are null
    if (this.args.id === 'new' || ejsData === null) {
      ejsInstance.clear();
      return;
    }

    ejsInstance.render(ejsData);
  });

  // remove editor
  unloadEditorJS(ejsTarget) {
    if (
      this.editorjs.instances != {} &&
      this.editorjs.instances[ejsTarget] !== undefined &&
      this.editorjs.instances[ejsTarget].blocks !== undefined
    ) {
      this.editorjs.instances[ejsTarget].destroy(); // destroy editorjs
      delete this.editorjs.instances[ejsTarget]; // delete editorjs key from record
    }
  }

  // initialize editor
  async loadEditorJS(module_input_slug, ejsTarget) {
    let editor_object_in_type = Object(this.type.currentType.modules).find(
      function (element) {
        if (element['input_slug'] == module_input_slug) return element;
      },
    );

    let primaryPlaceholder =
      editor_object_in_type !== undefined &&
      editor_object_in_type.input_placeholder !== undefined
        ? editor_object_in_type.input_placeholder
        : 'Type here...';

    let editorjsOptions = {
      holder: ejsTarget,
      data: this.object.currentObject
        ? this.object.currentObject.modules[module_input_slug]
        : {},
      placeholder: primaryPlaceholder,
      tools: {},
    };

    // ejsTool: pragraph
    editorjsOptions.tools.paragraph = {
      tunes: ['footnotes'],
    };

    // ejsTool: header
    editorjsOptions.tools.header = {
      class: Header,
      config: {
        placeholder:
          editor_object_in_type.input_options !== undefined &&
          editor_object_in_type.input_options.header_placeholder !== undefined
            ? editor_object_in_type.input_options.header_placeholder
            : 'Enter a header',
        defaultLevel: 4,
      },
    };

    // ejsTool: image
    editorjsOptions.tools.image = {
      class: ImageTool,
      config: {
        types: 'image/*, video/*',
        captionPlaceholder:
          editor_object_in_type.input_options !== undefined &&
          editor_object_in_type.input_options.image_caption_placeholder !==
            undefined
            ? editor_object_in_type.input_options.image_caption_placeholder
            : 'Caption',
        endpoints: {
          byFile: ENV.TribeENV.API_URL + '/uploads.php', // Your backend file uploader endpoint
          byUrl: ENV.TribeENV.API_URL + '/uploads.php', // Your endpoint that provides uploading by Url
        },
      },
    };

    // ejsTool: attachments
    editorjsOptions.tools.attaches = {
      class: AttachesTool,
      config: {
        endpoint: ENV.TribeENV.API_URL + '/uploads.php',
      },
    };

    // ejsTool: quote
    editorjsOptions.tools.quote = {
      class: Quote,
      inlineToolbar: true,
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder:
          editor_object_in_type.input_options !== undefined &&
          editor_object_in_type.input_options.quote_caption_placeholder !==
            undefined
            ? editor_object_in_type.input_options.quote_caption_placeholder
            : "Quote's author",
      },
    };

    // ejsTool: hyperlink
    editorjsOptions.tools.hyperlink = Hyperlink;

    // ejsTool: Table
    editorjsOptions.tools.table = Table;

    // ejsTool: Delimiter
    editorjsOptions.tools.delimiter = Delimiter;

    // ejsTool: Marker
    editorjsOptions.tools.Marker = {
      class: Marker,
    };

    // ejsTool: list
    editorjsOptions.tools.list = {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered',
      },
    };

    // ejsTool: raw
    editorjsOptions.tools.raw = {
      class: RawTool,
      config: {
        placeholder: 'Embed code or any HTML code',
      },
    };

    // ejsTool: code
    editorjsOptions.tools.code = {
      class: CodeTool,
      config: {
        placeholder: 'Inline code for display within text',
      },
    };

    // ejsTool: footnotes
    editorjsOptions.tools.footnotes = {
      class: FootnotesTune,
      config: {
        placeholder: 'Footnotes',
      },
    };

    let ejsInstance = new EditorJS(editorjsOptions);

    ejsInstance.isReady
      .then(() => {
        // TODO: clean up, this clearing of blocks is likely not needed
        if (this.objectID == 'new') {
          ejsInstance.blocks.clear();
        }

        this.editorjs.instances[ejsTarget] = ejsInstance;
      })
      .catch((e) => {
        console.error('Error during Editor.js initialization:', e);
      });
  }
}
