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
        _model_name : 'NCheckboxModel',
        _view_name : 'NCheckboxView',
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


// Model with default values for NlIconTab widget
var IconTabModel = controls.TabModel.extend({
    defaults: _.extend(controls.TabModel.prototype.defaults(), {
        _model_name : 'IconTabModel',
        _view_name : 'IconTabView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
	title_icons : []
    })
});


// TODO
// fix problem with long titles
// View for NlIconTab widget that renders the widget model.
var IconTabView = controls.TabView.extend({
    // Defines how the widget gets rendered into the DOM
    render: function() {
	controls.TabView.prototype.render.call(this);
        this.model.on('change:title_icons', this.icons_changed, this);
    },
        
    icons_changed: function() {
	const title_icons = this.model.get('title_icons');
        const tabBarTitles = this.pWidget.tabBar.node.childNodes[0].childNodes;
            
        for(var i=0 ; i < tabBarTitles.length; i++) {
	    // if an icon is specified for the tab at index i
            if (title_icons[i] != '') {
                var ic = null;

		// check if icon tag i is already added to tab title
		// tab title contains 3 child nodes without the icon
                if (tabBarTitles[i].childNodes.length < 4) {
                    ic = document.createElement('i');
                    ic.style = "width: 20px !important; padding-top:5px;";
                    tabBarTitles[i].appendChild(ic);
                }
		// if i tag is already added, set ic to i tag.
		else {
		    ic = tabBarTitles[i].childNodes[3];

		    // remove icon classes that already exists
                    var cl_length= ic.classList.length;
                    for (var j = cl_length - 1 ; j >= 0; j--) {
                        ic.classList.remove(ic.classList[j]);
                    }
                }

                ic.classList.add('fa');
                ic.classList.add('fa-' + title_icons[i]);
            }
        }
    }
});

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
    initialize: function() {
	PapayaView.__super__.initialize.apply(this, arguments);

	this.params = {};
        this.params['worldSpace'] = true;
        this.params['kioskMode'] = true;
	this.params["images"] = ["avg152T1_brain.nii.gz"];


	if (window.papaya === undefined) {

	    window.bowser = require('papaya-viewer/lib/bowser.js');
	    window.pako = require('papaya-viewer/lib/pako-inflate.js');
	    window.nifti = require('papaya-viewer/lib/nifti-reader.js');

	    var papaya_css = document.createElement('link');
	    papaya_css.setAttribute('href','https://raw.githack.com/rii-mango/Papaya/master/release/current/standard/papaya.css');
	    papaya_css.setAttribute('type', 'text/css');
	    papaya_css.setAttribute('rel', 'stylesheet');
	    document.head.appendChild(papaya_css);

	    var papaya_js = document.createElement('script');
	    papaya_js.setAttribute('src','https://raw.githack.com/rii-mango/Papaya/master/release/current/standard/papaya.js');
	    papaya_js.setAttribute('type', 'text/javascript');
	    document.head.appendChild(papaya_js);


	    papaya_js.onreadystatechange = this.start_papaya;
	    papaya_js.onload = this.start_papaya;
	} else {
	    console.log('calling other');
	    // TODO generate another container
	}
    },
    
    // Defines how the widget gets rendered into the DOM
    render: function() {
	this.papaya_div = document.createElement('div');
	this.papaya_div.classList.add('papaya');
	this.papaya_div.setAttribute("data-params", JSON.stringify(this.params));
	
	this.el.appendChild(this.papaya_div);
    },

    start_papaya: function() {
	window.papaya.Container.startPapaya();
    }

});


module.exports = {
    LinkModel: LinkModel,
    LinkView: LinkView,
    ProgressModel: ProgressModel,
    ProgressView: ProgressView,
    NCheckboxModel: NCheckboxModel,
    NCheckboxView: NCheckboxView,
    IconTabModel: IconTabModel,
    IconTabView: IconTabView,
    PapayaModel: PapayaModel,
    PapayaView: PapayaView
};
