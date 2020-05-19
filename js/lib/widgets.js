var widgets = require('@jupyter-widgets/base');
var controls = require('@jupyter-widgets/controls');

var _ = require('lodash');

var index = -1;

var papaya_gen = require('./papaya_frame.js');



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
        _view_module_version : '0.1.0',
	worldSpace : true,
	kioskMode: true,
	fullScreen: false,
	allowScroll: true,
	showControls: true,
	showControlBar: true,
	showImageButtons: true,
	orthogonal: true,
	mainView: "axial",
	coordinate:[],
	images:[]
    }),
});


// View for NlPapayaViewer widget that renders the widget model.
var PapayaView = widgets.DOMWidgetView.extend({
    initialize: function() {
	PapayaView.__super__.initialize.apply(this, arguments);

	this.params = [];
        this.params['worldSpace'] = this.model.get('worldSpace');
        this.params['kioskMode'] = this.model.get('kioskMode');
	this.params['fullScreenl'] = this.model.get('fullScreen');
	this.params['allowScroll'] = this.model.get('allowScroll');
	this.params['showControls'] = this.model.get('showControls');
	this.params['showControlBar'] = this.model.get('showControlBar');
	this.params['showImageButtons'] = this.model.get('showImageButtons');
	this.params['orthogonal'] = this.model.get('orthogonal');
	this.params['mainView'] = this.model.get('mainView');
	this.params['coordinate'] = this.model.get('coordinate');

	this.added_images = [];
	
        this.model.on('change:worldSpace change:kioskMode change:fullScreen change:allowScroll change:showControls change:showControlBar change:orthogonal change:mainView change:coordinate', this.ui_params_changed, this);

	this.model.on('change:atlas', this.atlas_changed, this);
        this.model.on('change:images', this.images_changed, this);

	this.papaya_frame = papaya_gen.createFrame(this);
    },
    
    // Defines how the widget gets rendered into the DOM
    render: function() {
	console.log('in render');
    },

    init_frame: function() {
 	this.papaya_frame.init();
	this.params["encodedImages"] = ["atlas"];
	this.atlas_changed();
    },

    atlas_changed: function() {
	this.papaya_frame.set_image("atlas", this.model.get('atlas'));
 	this.papaya_frame.reset_viewer(this.params);
   },
    
    ui_params_changed: function(event) {
	if (event !== undefined) {
	    for ( const [key,value] of Object.entries( event.changed ) ) {
		this.params[key] = value;
	    }
	    this.papaya_frame.reset_viewer(this.params);
	}
    },

    images_changed: function(event) {
	console.log(event);

	var images = this.model.get("images");

	var imageRefs = ["atlas"];
	var imageName = "";
	
	for (var i = 0; i < images.length; i++) {
	    imageName = "image"+ i;
	    imageRefs.push(imageName);
	    var image = images[i].image;
	    
	    if (!this.added_images.includes(image)) {
		this.added_images.push(image);
		this.papaya_frame.set_image(imageName, image);
		
		this.params["encodedImages"] = imageRefs;
		this.params[imageName] = images[i].config;
		//	this.papaya_frame.reset_viewer(this.params);
		var imageParams = [];
		imageParams[imageName] = images[i].config;
		this.papaya_frame.add_image(imageName, imageParams);
	    }

	}
	this.papaya_frame.update_params(this.params);

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
