var widgets = require('@jupyter-widgets/base');
var controls = require('@jupyter-widgets/controls');

var _ = require('lodash');

// Model with default values for NlLink widget
var LinkModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'LinkModel',
        _view_name : 'LinkView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
	value : '',
	href : ''

    })
});


// View for NlLink widget that renders the widget model.
var LinkView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
	this.link = document.createElement('a');
        this.link.setAttribute('target', '_blank');
	
        this.value_changed();

	this.el.appendChild(this.link);


        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change', this.value_changed, this);
    },

    value_changed: function() {
	this.link.setAttribute('href', this.model.get('href'));
        this.link.innerHTML = this.model.get('value');
    }
});


// Model with default values for NlProgress widget
var ProgressModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'ProgressModel',
        _view_name : 'ProgressView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
	value : 0,
	max : 0

    })
});


// View for NlProgress widget that renders the widget model.
var ProgressView = widgets.DOMWidgetView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
	this.progress = document.createElement('progress');
	
        this.value_changed();

	this.el.appendChild(this.progress);


        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change', this.value_changed, this);
    },

    value_changed: function() {
        this.progress.setAttribute('value',  this.model.get('value'));
        this.progress.setAttribute('title',  this.model.get('value'));
        this.progress.setAttribute('max', this.model.get('max'));
    }
});


// Model with default values for NlCheckbox widget
var NCheckboxModel = controls.CheckboxModel.extend({
    defaults: _.extend(controls.CheckboxModel.prototype.defaults(), {
        _model_name : 'NlCheckboxModel',
        _view_name : 'NlCheckboxView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
	opacity : '0.45'
    })
});


// View for NlCheckbox widget that renders the widget model.
var NCheckboxView = controls.CheckboxView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
	controls.CheckboxView.prototype.render.call(this);

        // Observe changes in the value traitlet in Python, and define
        // a custom callback.
        this.model.on('change:disabled', this.disabled_changed, this);
        this.model.on('change:opacity', this.opacity_changed, this);
    },

    disabled_changed: function() {
        if (this.model.get('disabled')) {
	    this.el.childNodes[1].style.opacity=this.model.get('opacity')
        } else {
            this.el.childNodes[1].style.opacity=1
        }
    },

    opacity_changed: function() {
        if (this.model.get('disabled')) {
	    this.el.childNodes[1].style.opacity=this.model.get('opacity')
        } 
    }
});


module.exports = {
    LinkModel: LinkModel,
    LinkView: LinkView,
    ProgressModel: ProgressModel,
    ProgressView: ProgressView,
    NCheckboxModel: NCheckboxModel,
    NCheckboxView: NCheckboxView
};
