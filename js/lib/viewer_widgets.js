var widgets = require('@jupyter-widgets/base');
var controls = require('@jupyter-widgets/controls');

var _ = require('lodash');

var bowser = require('papaya-viewer/lib/bowser');
var papaya = require('papaya-viewer/release/current/standard/papaya');


// Model with default values for NlPapayaViewer widget
var PapayaModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'PapayaModel',
        _view_name : 'PapayaView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0'

    })
});


// View for NlPapayaViewer widget that renders the widget model.
var PapayaView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
//	console.log(papaya)
	this.papaya = document.createElement('div');
	this.papaya.classList.add('papaya');
	this.el.appendChild(this.papaya);
    }

});

module.exports = {
    PapayaModel: PapayaModel,
    PapayaView: PapayaView
};

