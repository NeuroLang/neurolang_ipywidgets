var plugin = require("./index");
var base = require("@jupyter-widgets/base");

module.exports = {
  id: "neurolang_ipywidgets",
  requires: [base.IJupyterWidgetRegistry],
  activate: function (app, widgets) {
    widgets.registerWidget({
      name: "neurolang_ipywidgets",
      version: plugin.version,
      exports: plugin,
    });
  },
  autoStart: true,
};
