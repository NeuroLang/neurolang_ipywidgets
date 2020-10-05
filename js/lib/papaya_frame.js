// static assets are put under nbextensions directory following
// https://minrk-ipywidgets.readthedocs.io/en/latest/examples/Widget%20Low%20Level.html#Static-assets
// this is necessary to be able to copy static assets under nbextensions directory
var $ = require("jquery");

require("../custom/css/frame_styles.css");
require("../custom/css/papaya.css");
require("../custom/lib/papaya.js");

// Links to static assets are set under `/nbextensions/neurolang-ipywidgets` directory
var papaya_src = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="/nbextensions/neurolang-ipywidgets/css/frame_styles.css" />
        <link rel="stylesheet" type="text/css" href="/nbextensions/neurolang-ipywidgets/css/papaya.css" />
        <script type="text/javascript" src="/nbextensions/neurolang-ipywidgets/lib/papaya.js"></script>
        <title>Papaya Viewer</title>

        <script type="text/javascript">
            var params = [];
        </script>
    </head>

    <body>
        <div id="papayaParent">
            <div class="papaya" data-params="params"></div>
        </div>
    </body>
</html>`;

var index = 0;

let ColorBar = class {
  constructor(length, top) {
    this.colorBar = document.createElement("div");
    this.colorBar.id = "colorBar";
    this.colorBar.style.width = length + "px";
    this.colorBar.style.top = "-" + top + "px";

    var div = document.createElement("div");
    div.id = "image-div";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.position = "absolute";

    this.divMin = document.createElement("div");
    this.divMin.id = "min-div";
    this.divMin.classList.add("values", "minValue");

    this.divImg = document.createElement("IMG");
    this.divImg.style.width = "100%";
    this.divImg.style.height = "100%";

    this.divMax = document.createElement("div");
    this.divMax.id = "max-div";
    this.divMax.classList.add("values", "maxValue");

    div.appendChild(this.divMin);
    div.appendChild(this.divImg);
    div.appendChild(this.divMax);

    this.colorBar.appendChild(div);
  }

  getElement() {
    return this.colorBar;
  }

  setMin(min) {
    this.divMin.textContent = min;
  }

  setMax(max) {
    this.divMax.textContent = max;
  }

  setImageSrc(imageSrc) {
    this.divImg.src = imageSrc;
  }

  show(isShow) {
    if (isShow) {
      this.colorBar.style.display = "block";
    } else {
      this.colorBar.style.display = "none";
    }
  }
};

let PapayaFrame = class {
  /**
   * Creates a new frame and puts the papaya viewer inside the frame
   * to isolate it from the main window.
   *
   * index: index of the frame.
   * parentView: PapayaView instance that contains this frame.
   */
  constructor(index, parentView) {
    this.name = "papayaFrame" + index;
    this.index = index;
    this.parent = parentView;

    var papayaFrameDiv = document.createElement("div");
    papayaFrameDiv.style.width = "100%";
    papayaFrameDiv.style.height = "100%";
    papayaFrameDiv.id = "papaya-viewer";

    // create frame for papaya viewer
    this.frameElement = document.createElement("IFRAME");
    this.frameElement.srcdoc = papaya_src;
    this.frameElement.name = this.name;
    this.frameElement.style.width = "100%";
    this.frameElement.style.height = "100%";
    this.frameElement.style.display = "inline-block";

    papayaFrameDiv.appendChild(this.frameElement);

    this.papayaFrameDiv = papayaFrameDiv;

    var that = this;
    this.frameElement.onload = function () {
      that.parent.initFrame();
    };
  }

  /**
   * Returns the dom element for papaya viewer.
   */
  getDiv() {
    return this.papayaFrameDiv;
  }

  /**
   * Sets the window and papaya container when the frame is
   * initialized. It also updates parameters and sets the atlas.
   *
   * params: papaya parameters to be set.
   * atlas_image: base64 encoded atlas image.
   *
   * Note: "atlas" should exist as 0th element in the params["encodedImages"]
   * array as below:
   * params["encodedImages"] = ["atlas", "image1", "image2"];
   *
   */
  init(params, atlas_image, isShow) {
    this.window = window[this.name];

    this.setImage("atlas", atlas_image);
    this.resetViewer(params);

    if (this.window.document) {
      var papayaViewer = this.window.document.getElementById("papayaViewer0");
      this.colorBar = new ColorBar(
        parseInt(papayaViewer.style.height.replace("px", "")) * 0.8,
        parseInt(papayaViewer.style.height.replace("px", "")) + 90
      );
      this.window.document
        .getElementById("papayaParent")
        .appendChild(this.colorBar.getElement());
      this.colorBar.show(isShow);
    }
  }

  /**
   * Resets the papaya container viewer with params.
   *
   * params: papaya parameters to be set.
   */
  resetViewer(params) {
    this.window.papaya.Container.resetViewer(0, params);
  }

  /**
   *
   *
   */
  showColorBar(show) {
    if (this.colorBar) {
      this.colorBar.show(show);
    }
  }

  /**
   *
   *
   */
  setColorBar(index) {
    if (index < this.window.papayaContainers[0].viewer.screenVolumes.length) {
      this.colorBar.setMin(
        this.window.papayaContainers[0].viewer.screenVolumes[
          index
        ].screenMin.toFixed(2)
      );
      this.colorBar.setMax(
        this.window.papayaContainers[0].viewer.screenVolumes[
          index
        ].screenMax.toFixed(2)
      );
      this.colorBar.setImageSrc(
        this.window.papayaContainers[0].viewer.screenVolumes[index].colorBar
      );
    }
  }

  /**
   *
   *
   */
  changeCoordinate(coord) {
    var new_coord = new this.window.papaya.core.Coordinate(
      coord[0],
      coord[1],
      coord[2]
    );
    this.window.papayaContainers[0].viewer.gotoWorldCoordinate(
      new_coord,
      false
    );
  }

  /**
   * Sets the image as a global variable with the specified name.
   *
   * name: name of the image variable.
   * image: base64 encoded image.
   */
  setImage(name, image) {
    this.window[name] = image;
  }

  /**
   * Deletes the global variable with the specified name.
   *
   */
  unsetImage(name) {
    delete this.window[name];
  }

  /**
   *
   *
   */
  addImage(imageName, image, params) {
    this.setImage(imageName, image);
    this.window.papaya.Container.addImage(0, imageName, params);
  }

  /**
   *
   *
   */
  removeImage(index) {
    this.window.papaya.Container.removeImage(0, index);
  }

  /**
   *
   *
   */
  loadFunction(index, images, callback) {
    var that = this;
    if (index < images.length) {
      var papayaImage = images[index];
      var imageName = "image" + papayaImage.id;
      var image = papayaImage.image;

      var config = $.extend({}, papayaImage.config, {
        loadingComplete: function () {
          if (index == images.length - 1) {
            callback();
          }
          that.loadFunction(index + 1, images, callback);
        },
      });

      var imageParams = [];
      imageParams[imageName] = config;

      this.addImage(imageName, image, imageParams);
    }
  }
};

var createFrame = function (parentView) {
  var papayaFrame = new PapayaFrame(index, parentView);
  index++;

  return papayaFrame;
};

module.exports = {
  createFrame,
};
