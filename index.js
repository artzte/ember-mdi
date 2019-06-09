'use strict';

// const svgstore = require('broccoli-svgstore');
// const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const writeFile = require('broccoli-file-creator');
const path = require('path');
const resolve = require('resolve');
const defaultOptions = {
  icons: null
};

module.exports = {
  name: require('./package').name,

  // treeForPublic() {
  // const svgsPath = path.join('node_modules', '@mdi', 'svg', 'svg');
  // const options = Object.assign({}, defaultOptions, this.app.options[this.name]);
  // const include = Array.isArray(options.icons) ? options.icons.map(item => item + '.svg') : null;

  // const publicTree = new Funnel(svgsPath, {
  //   include
  // });

  // const svgstoreTree = svgstore(publicTree, {
  //   outputFile: '/assets/icons.svg'
  // });

  // return svgstoreTree;
  // },

  included() {
    this._super.included.apply(this, arguments);
    this._ensureFindHost();

    // let vendorPath = `vendor/${this.name}`;
    // let options = Object.assign({}, defaultOptions, app.options[this.name]);
    let host = this._findHost();

    host.import('vendor/ember-mdi/icons.js');
  },

  treeForVendor(vendorTree) {
    const icons = 'export default {hello:123}';
    const babelAddon = this.addons.find(addon => addon.name === 'ember-cli-babel');
    const iconsFile = writeFile('ember-mdi/icons.js', icons);

    return mergeTrees([vendorTree, babelAddon.transpileTree(iconsFile)]);
  },

  resolvePackagePath(packageName) {
    let host = this._findHost();
    return path.dirname(resolve.sync(`${packageName}/package.json`, { basedir: host.project.root }));
  },

  _ensureFindHost() {
    if (!this._findHost) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;

        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));

        return app;
      };
    }
  }
};
