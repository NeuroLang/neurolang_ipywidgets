var widgets = require('@jupyter-widgets/base');
var controls = require('@jupyter-widgets/controls');
const CodeMirror = require('codemirror');

var _ = require('lodash');

var index = -1;

var papayaGenerator = require('./papaya_frame.js');


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


// View for NlIconTab widget that renders the widget model.
var IconTabView = controls.TabView.extend({
    initialize: function() {
	IconTabView.__super__.initialize.apply(this, arguments);
        this.model.on('change:title_icons', this.iconsChanged, this);
   },
    
    // Defines how the widget gets rendered into the DOM
    render: function() {
	IconTabView.__super__.render.apply(this, arguments);
	// this has no effect on initially displaying icons, can be removed
	this.iconsChanged();
    },
        
    iconsChanged: function() {
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
	kioskMode : false,
	fullScreen : true,
	allowScroll : true,
	showControls : true,
	showControlBar : true,
	showImageButtons : true,
	orthogonal : true,
	mainView : "axial",
	coordinate : [],
	images : [],
	error : ""
    }),
});


// View for NlPapayaViewer widget that renders the widget model.
var PapayaView = widgets.DOMWidgetView.extend({

    /**
    * When the new papaya frame loads, initializes window and containers for papaya.
    */
    initFrame: function() {
	var imageParams = {"encodedImages" : ["atlas"]};
 	this.papayaFrame.init($.extend({}, this.params, imageParams), this.model.get('atlas'));
    },

    atlasChanged: function() {
	// think of keeping images or removing all when atlas changed
	// this.papayaFrame.setImage("atlas", this.model.get('atlas'));
 	// this.papayaFrame.resetViewer(this.params);
	// do not forget to change coordinate
    },

    coordinateChanged: function() {
 	this.papayaFrame.changeCoordinate(this.model.get('coordinate'));
    },

    // Defines how the widget gets rendered into the DOM
    render: function() {
	PapayaView.__super__.render.apply(this, arguments);

	this.params = [];
        this.params['worldSpace'] = this.model.get('worldSpace');
        this.params['kioskMode'] = this.model.get('kioskMode');
	this.params['fullScreen'] = this.model.get('fullScreen');
	this.params['allowScroll'] = this.model.get('allowScroll');
	this.params['showControls'] = this.model.get('showControls');
	this.params['showControlBar'] = this.model.get('showControlBar');
	this.params['showImageButtons'] = this.model.get('showImageButtons');
	this.params['orthogonal'] = this.model.get('orthogonal');
	this.params['mainView'] = this.model.get('mainView');
	this.params['coordinate'] = this.model.get('coordinate');
	
	this.papayaFrame = papayaGenerator.createFrame(this);

	this.images = [];

	
	this.model.on('change:coordinate', this.coordinateChanged, this);
	this.model.on('change:atlas', this.atlasChanged, this);
	this.model.on('change:error', this.errorChanged, this);
        this.model.on('change:images', this.imagesChanged, this);
    },

    errorChanged: function() {
	var error = this.model.get("error");
	console.log("error");
	console.log(error);
	if (error != "") {
	    alert(error);
	    // this.model.set('error', '', { updated_view: this });
	    // below two lines does not update model in backend
	    // this.model.save_changes();
	    // this.touch();
	}

    },


   imagesChanged: function(event) {

       var initial_length = this.images.length;

       // remove all images
       for (var i = initial_length; i > 0; i--) {
       	   this.papayaFrame.removeImage(i);
       }

       var index = 0;

       this.images = this.model.get("images");
       // add new images
       this.papayaFrame.loadFunction(index, this.images);
   }
    
});

var CodeEditorModel = widgets.DOMWidgetModel.extend({
    defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
        _model_name : 'CodeEditorModel',
        _view_name : 'CodeEditorView',
        _model_module : 'neurolang-ipywidgets',
        _view_module : 'neurolang-ipywidgets',
        _model_module_version : '0.1.0',
        _view_module_version : '0.1.0',
	text : "",
	marks : [], // errors, warnings etc.
    }),
});

var CodeEditorView = widgets.DOMWidgetView.extend({
    render: function() {
	let ta = document.createElement('textarea');
	this.el.appendChild(ta);
        this.editor = CodeMirror.fromTextArea(ta,
	  {
	    lineNumbers: true,
	    gutters: ["CodeMirror-linenumbers", 
	      {className: "marks",
	       style: "width: .9em"}]
	  });
        this.editor.refresh();
        this.editor.setSize(null, 100);
        this.editor.on("change", this.text_edited.bind(this));

        this.model.on('change:text', this.text_changed, this);
        this.model.on('change:marks', this.marks_changed, this);

        this.text_changed();
        this.marks_changed();
    },

    text_changed: function() {
      const modelValue = this.model.get('text');
      if(modelValue != this.editor.getValue()){
	this.editor.setValue(modelValue);
      }
    },

    marks_changed: function() {
      this.editor.clearGutter('marks');
      const marks = this.model.get('marks');
      marks.forEach((elt) => {
        this.editor.setGutterMarker(elt.line, 'marks', makeMarker(elt.text));
      });
    },

    text_edited: function() {
      this.model.set('text', this.editor.getValue());
      this.touch();
    }
});

function makeMarker(title){
  let marker = document.createElement("div");
  marker.style.color = "#822";
  marker.innerHTML = "❌";
  marker.setAttribute("title", title);
  return marker;
}

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
    PapayaView: PapayaView,
    CodeEditorModel,
    CodeEditorView,
};
