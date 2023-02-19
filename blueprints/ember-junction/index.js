'use strict';

module.exports = {
  normalizeEntityName() {},
  
  afterInstall(options) {
    return this.addAddonsToProject({
    }).then(() => {
      return this.addPackagesToProject([
        { name: '@editorjs/editorjs' },
      ]);
    });
  }
};
