var $ = require("jquery");

var widgets = require("@jupyter-widgets/base");
var controls = require("@jupyter-widgets/controls");
const CodeMirror = require("codemirror");
require("codemirror/addon/display/autorefresh");

var _ = require("lodash");

var papayaGenerator = require("./papaya_frame.js");

require("../css/styles.css");

// Model with default values for NlLink widget
var LinkModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "LinkModel",
    _view_name: "LinkView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    value: "",
    href: "",
  }),
});

// View for NlLink widget that renders the widget model.
var LinkView = widgets.DOMWidgetView.extend({
  // Defines how the widget gets rendered into the DOM
  render: function () {
    this.link = document.createElement("a");
    this.link.setAttribute("target", "_blank");

    this.value_changed();
    this.el.appendChild(this.link);

    // Observe changes in the value traitlet in Python, and define
    // a custom callback.
    this.model.on("change", this.value_changed, this);
  },

  value_changed: function () {
    this.link.setAttribute("href", this.model.get("href"));
    this.link.innerHTML = this.model.get("value");
  },
});

// Model with default values for NlProgress widget
var ProgressModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "ProgressModel",
    _view_name: "ProgressView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    value: 0,
    max: 0,
  }),
});

// View for NlProgress widget that renders the widget model.
var ProgressView = widgets.DOMWidgetView.extend({
  // Defines how the widget gets rendered into the DOM
  render: function () {
    this.progress = document.createElement("progress");

    this.value_changed();

    this.el.appendChild(this.progress);

    // Observe changes in the value traitlet in Python, and define
    // a custom callback.
    this.model.on("change", this.value_changed, this);
  },

  value_changed: function () {
    this.progress.setAttribute("value", this.model.get("value"));
    this.progress.setAttribute("title", this.model.get("value"));
    this.progress.setAttribute("max", this.model.get("max"));
  },
});

// Model with default values for NlCheckbox widget
var NCheckboxModel = controls.CheckboxModel.extend({
  defaults: _.extend(controls.CheckboxModel.prototype.defaults(), {
    _model_name: "NCheckboxModel",
    _view_name: "NCheckboxView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    opacity: "0.45",
    bg_color: "white",
  }),
});

// View for NlCheckbox widget that renders the widget model.
var NCheckboxView = controls.CheckboxView.extend({
  // Defines how the widget gets rendered into the DOM
  render: function () {
    controls.CheckboxView.prototype.render.call(this);

    // Observe changes in the value traitlet in Python, and define
    // a custom callback.
    this.model.on("change:disabled", this.disabled_changed, this);
    this.model.on("change:opacity", this.opacity_changed, this);
    this.model.on("change:bg_color", this.bg_color_changed, this);
  },

  disabled_changed: function () {
    if (this.model.get("disabled")) {
      this.el.childNodes[1].style.opacity = this.model.get("opacity");
    } else {
      this.el.childNodes[1].style.opacity = 1;
    }
  },

  opacity_changed: function () {
    if (this.model.get("disabled")) {
      this.el.childNodes[1].style.opacity = this.model.get("opacity");
    }
  },

  bg_color_changed: function () {
    if (this.model.get("bg_color") !== "") {
      this.el.childNodes[1].style.backgroundColor = this.model.get("bg_color");
    } else {
      this.el.childNodes[1].style.backgroundColor = "white";
    }
  },
});

// Model with default values for NlIconTab widget
var IconTabModel = controls.TabModel.extend({
  defaults: _.extend(controls.TabModel.prototype.defaults(), {
    _model_name: "IconTabModel",
    _view_name: "IconTabView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    title_icons: [],
  }),
});

// View for NlIconTab widget that renders the widget model.
var IconTabView = controls.TabView.extend({
  initialize: function () {
    IconTabView.__super__.initialize.apply(this, arguments);
    this.model.on("change:title_icons", this.iconsChanged, this);
  },

  // Defines how the widget gets rendered into the DOM
  render: function () {
    IconTabView.__super__.render.apply(this, arguments);
    // this has no effect on initially displaying icons, can be removed
    this.iconsChanged();
  },

  iconsChanged: function () {
    const title_icons = this.model.get("title_icons");
    const tabBarTitles = this.pWidget.tabBar.node.childNodes[0].childNodes;

    for (var i = 0; i < tabBarTitles.length; i++) {
      // if an icon is specified for the tab at index i
      if (title_icons[i] != "") {
        var ic = null;

        // check if icon tag i is already added to tab title
        // tab title contains 3 child nodes without the icon
        if (tabBarTitles[i].childNodes.length < 4) {
          ic = document.createElement("i");
          ic.style = "width: 20px !important; padding-top:5px;";
          tabBarTitles[i].appendChild(ic);
        }
        // if i tag is already added, set ic to i tag.
        else {
          ic = tabBarTitles[i].childNodes[3];

          // remove icon classes that already exists
          var cl_length = ic.classList.length;
          for (var j = cl_length - 1; j >= 0; j--) {
            ic.classList.remove(ic.classList[j]);
          }
        }

        ic.classList.add("fa");
        ic.classList.add("fa-" + title_icons[i]);
      }
    }
  },
});

// Model with default values for NlPapayaViewer widget
var PapayaModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "PapayaModel",
    _view_name: "PapayaView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    worldSpace: true,
    kioskMode: true,
    fullScreen: false,
    allowScroll: true,
    showControls: true,
    showControlBar: true,
    showImageButtons: false,
    orthogonal: true,
    mainView: "axial",
    coordinate: [],
    images: [],
    error: "",
    colorbar: true,
    colorbar_index: 0,
    luts: [],
  }),
});

// View for NlPapayaViewer widget that renders the widget model.
var PapayaView = widgets.DOMWidgetView.extend({
  // Defines how the widget gets rendered into the DOM
  render: function () {
    PapayaView.__super__.render.apply(this, arguments);

    this.loaded = true;

    this.params = [];
    this.params["worldSpace"] = this.model.get("worldSpace");
    this.params["kioskMode"] = this.model.get("kioskMode");
    this.params["fullScreen"] = this.model.get("fullScreen");
    this.params["allowScroll"] = this.model.get("allowScroll");
    this.params["showControls"] = this.model.get("showControls");
    this.params["showControlBar"] = this.model.get("showControlBar");
    this.params["showImageButtons"] = this.model.get("showImageButtons");
    this.params["orthogonal"] = this.model.get("orthogonal");
    this.params["mainView"] = this.model.get("mainView");
    this.params["coordinate"] = this.model.get("coordinate");
    this.params["luts"] = this.model.get("luts");

    // PapayaFrame instance to access papaya viewer functionality
    this.papayaFrame = papayaGenerator.createFrame(this);

    this.el.appendChild(this.papayaFrame.getDiv());

    this.images = [];

    this.model.on("change:coordinate", this.coordinateChanged, this);
    this.model.on("change:atlas", this.atlasChanged, this);
    this.model.on("change:error", this.errorChanged, this);
    this.model.on("change:images", this.imagesChanged, this);
    this.model.on("change:colorbar", this.colorBarChanged, this);
    this.model.on("change:colorbar_index", this.colorBarIndexChanged, this);
  },

  /**
   * When the new papaya frame loads, initializes window and containers for papaya.
   */
  initFrame: function () {
    var imageParams = { encodedImages: ["atlas"] };
    this.papayaFrame.init(
      $.extend({}, this.params, imageParams),
      this.model.get("atlas"),
      this.model.get("colorbar")
    );
    this.colorBarIndexChanged();
  },

  atlasChanged: function () {
    // think of keeping images or removing all when atlas changed
    // this.papayaFrame.setImage("atlas", this.model.get('atlas'));
    // this.papayaFrame.resetViewer(this.params);
    // do not forget to change coordinate
  },

  coordinateChanged: function () {
    this.papayaFrame.changeCoordinate(this.model.get("coordinate"));
  },

  errorChanged: function () {
    var error = this.model.get("error");
    //	console.log("error");
    //	console.log(error);
    if (error != "") {
      alert(error);
      // this.model.set('error', '', { updated_view: this });
      // below two lines does not update model in backend
      // this.model.save_changes();
      // this.touch();
    }
  },

  imagesChanged: function () {
    // papaya image loading is async.
    // this is to prevent a second call before all images are loaded.
    if (!this.loaded) {
      setTimeout(this.imagesChanged.bind(this), 5); // wait 20ms
      return;
    }

    // value of this changed by callback-imagesLoaded when all images are finished loading
    this.loaded = false;

    var initial_length = this.images.length;

    // remove all images
    for (var i = initial_length; i > 0; i--) {
      this.papayaFrame.removeImage(i);
      this.papayaFrame.unsetImage("image" + this.images[i - 1].id);
    }

    // this line should be set
    this.images = this.model.get("images");

    if (this.images.length == 0) {
      this.imagesLoaded();
    }

    // add new images
    this.papayaFrame.loadFunction(0, this.images, this.imagesLoaded.bind(this));
  },

  imagesLoaded: function () {
    this.loaded = true;
    this.colorBarIndexChanged();
  },

  colorBarChanged: function () {
    this.papayaFrame.showColorBar(this.model.get("colorbar"));
  },

  colorBarIndexChanged: function () {
    // papaya image loading is async.
    // this is to prevent a second call before all images are loaded.
    if (!this.loaded) {
      setTimeout(this.colorBarIndexChanged.bind(this), 5); // wait 20ms
      return;
    }

    this.papayaFrame.setColorBar(this.model.get("colorbar_index"));
  },
});

var CodeEditorModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "CodeEditorModel",
    _view_name: "CodeEditorView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    text: "",
    marks: [], // errors, warnings etc.
    text_marks: [], // spans of text that will be marked (e.g. squiggly underline)
  }),
});

var CodeEditorView = widgets.DOMWidgetView.extend({
  render: function () {
    let ta = document.createElement("textarea");
    this.el.appendChild(ta);
    this.editor = CodeMirror.fromTextArea(ta, {
      autoRefresh: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: [
        "CodeMirror-linenumbers",
        { className: "marks", style: "width: .9em" },
      ],
    });
    this.editor.setSize(null, 100);
    this.editor.on("change", this.text_edited.bind(this));

    this.model.on("change:text", this.text_changed, this);
    this.model.on("change:marks", this.marks_changed, this);
    this.model.on("change:text_marks", this.text_marks_changed, this);

    this.text_changed();
    this.marks_changed();
    this.text_marks_changed();
  },

  text_changed: function () {
    const modelValue = this.model.get("text");
    if (modelValue != this.editor.getValue()) {
      this.editor.setValue(modelValue);
    }
  },

  marks_changed: function () {
    this.editor.clearGutter("marks");
    const marks = this.model.get("marks");
    marks.forEach((elt) => {
      this.editor.setGutterMarker(elt.line, "marks", makeMarker(elt.text));
    });
  },

  text_marks_changed: function () {
    this.editor.getAllMarks().forEach((elt) => elt.clear());

    const textMarks = this.model.get("text_marks");
    textMarks.forEach((elt) => {
      this.editor.markText(elt.from, elt.to, {
        css: "text-decoration: red wavy underline",
      });
    });
  },

  text_edited: function () {
    this.model.set("text", this.editor.getValue());
    this.touch();
  },
});

function makeMarker(title) {
  let marker = document.createElement("div");
  marker.style.color = "#822";
  marker.innerHTML = "❌";
  marker.setAttribute("title", title);
  return marker;
}

// Model with default values for NlVBoxOverlay widget
var VBoxOverlayModel = controls.VBoxModel.extend({
  defaults: _.extend(controls.VBoxModel.prototype.defaults(), {
    _model_name: "VBoxOverlayModel",
    _view_name: "VBoxOverlayView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
  }),
});

// View for NlVBoxOverlay widget that renders the widget model.
var VBoxOverlayView = controls.VBoxView.extend({
  initialize: function () {
    VBoxOverlayView.__super__.initialize.apply(this, arguments);
  },
  // Defines how the widget gets rendered into the DOM
  render: function () {
    VBoxOverlayView.__super__.render.apply(this, arguments);

    this.el.style.zIndex = 1000;
    this.el.style.position = "relative";
    this.el.style.overflow = "visible";
    this.el.style.background = "rgb(221, 221, 221)";
    this.el.style.border = "solid";
    this.el.style.borderWidth = "1px";
    this.el.style.borderColor = "rgb(89, 89, 89)";
    this.el.style.opacity = 1;
  },
});

// Model with default values for NlDownloadLink widget
var DownloadLinkModel = widgets.DOMWidgetModel.extend({
  defaults: _.extend(widgets.DOMWidgetModel.prototype.defaults(), {
    _model_name: "DownloadLinkModel",
    _view_name: "DownloadLinkView",
    _model_module: "neurolang-ipywidgets",
    _view_module: "neurolang-ipywidgets",
    _model_module_version: "0.1.0",
    _view_module_version: "0.1.0",
    content: "",
    mimetype: "text/csv",
    filename: "",
    tooltip: "",
    disabled: false,
  }),
});

// View for NlDownloadLink widget that renders the widget model.
var DownloadLinkView = widgets.DOMWidgetView.extend({
  // Defines how the widget gets rendered into the DOM
  render: function () {
    DownloadLinkView.__super__.render.apply(this, arguments);
    this.el.classList.add("jupyter-widgets");
    this.el.classList.add("jupyter-button");
    this.el.classList.add("widget-button");

    this.link = document.createElement("a");
    this.link.setAttribute("target", "_blank");
    this.link.style.width = "100%";
    this.link.style.height = "100%";

    this.filename_changed();
    this.mimetype_changed();
    this.disabled_changed();
    this.tooltip_changed();
    this.description_changed();

    this.el.appendChild(this.link);

    // Observe changes in the value traitlet in Python, and define
    // a custom callback.
    this.model.on("change:filename", this.filename_changed, this);
    this.model.on("change:mimetype", this.mimetype_changed, this);
    this.model.on("change:disabled", this.disabled_changed, this);
    this.model.on("change:tooltip", this.tooltip_changed, this);
    this.model.on("change:content", this.content_changed, this);
    this.model.on("change:description", this.description_changed, this);
  },

  filename_changed: function () {
    this.link.setAttribute("download", this.model.get("filename"));
  },

  mimetype_changed: function () {
    this.link.setAttribute(
      "href",
      "data:" +
        this.model.get("mimetype") +
        ";base64," +
        this.model.get("content")
    );
  },

  disabled_changed: function () {
    this.link.disabled = this.model.get("disabled");
    if (this.link.disabled) {
      this.link.classList.add("disabled");
    } else this.link.classList.remove("disabled");
  },

  tooltip_changed: function () {
    this.link.setAttribute("title", this.model.get("tooltip"));
  },

  description_changed: function () {
    this.link.innerHTML =
      '<i class="fa fa-download" style="color:black; margin-left:auto; margin-right:auto;"></i>  ' +
      this.model.get("description");
  },

  content_changed: function () {
    if (this.model.get("content") != "") {
      this.link.setAttribute("download", this.model.get("filename"));
      this.link.setAttribute(
        "href",
        "data:" +
          this.model.get("mimetype") +
          ";base64," +
          this.model.get("content")
      );
      this.link.click();
      this.model.set("content", "");
      this.touch();
    }
  },

  // events and _handle_click methods are copied from ButtonView to handle click on the link
  /**
   * Dictionary of events and handlers
   */
  events: function () {
    return { click: "_handle_click" };
  },

  /**
   * Handles when the button is clicked.
   */
  _handle_click: function (event) {
    // this is necessary when data is big and it content should not be set at when widget is initialized
    if (this.model.get("content") === "") {
      event.preventDefault();
      this.send({ event: "click" });
      return false;
    } else {
      return true;
    }
  },
});

module.exports = {
  LinkModel,
  LinkView,
  ProgressModel,
  ProgressView,
  NCheckboxModel,
  NCheckboxView,
  IconTabModel,
  IconTabView,
  PapayaModel,
  PapayaView,
  CodeEditorModel,
  CodeEditorView,
  VBoxOverlayModel,
  VBoxOverlayView,
  DownloadLinkModel,
  DownloadLinkView,
};
