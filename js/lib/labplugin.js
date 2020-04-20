var plugin = require('./index');
var base = require('@jupyter-widgets/base');

module.exports = {
  id: 'neurolang-ipywidgets',
  requires: [base.IJupyterWidgetRegistry],
  activate: function(app, widgets) {
      widgets.registerWidget({
          name: 'neurolang-ipywidgets',
          version: plugin.version,
          exports: plugin
      });
  },
  autoStart: true
};

