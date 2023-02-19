'use strict';

module.exports = {
  normalizeEntityName() {},
  
  afterInstall(options) {
    return this.addPackagesToProject([
      { name: '@editorjs/editorjs' },
    ]);
  }
};
