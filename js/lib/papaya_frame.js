var papaya_src = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
        <link rel="stylesheet" type="text/css" href="https://raw.githack.com/rii-mango/Papaya/master/release/current/standard/papaya.css" />
        <script type="text/javascript" src="https://raw.githack.com/rii-mango/Papaya/master/release/current/standard/papaya.js"></script>
        <title>Papaya Viewer</title>

        <script type="text/javascript">
            var params = [];
        </script>
    </head>

    <body>
        <div id="papaya_parent">
            <div class="papaya" data-params="params"></div>
        </div>
    </body>
</html>`;



var index = 0;

let PapayaFrame = class {
    /**
     * Creates a new frame and puts the papaya viewer inside the frame
     * to isolate it from the main window.
     *
     * index: index of the frame.
     * parent: parent element in the main window to add this frame.
     */
    constructor(index, parent) {
	var frameElement = document.createElement("IFRAME");
	this.name = "papayaFrame" + index;
	this.index = index;

	// create frame for papaya and add it to parent
	frameElement.srcdoc = papaya_src;
	frameElement.name = this.name;
	frameElement.width="100%";
	frameElement.height="100%";

	var that = parent;
	frameElement.onload = function() {
	    that.initFrame();
	}

	parent.el.appendChild(frameElement);
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
    init(params, atlas_image) {
	this.window =  window[this.name];
	this.setImage("atlas", atlas_image);
	this.resetViewer(params);
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
    changeCoordinate(coord) {
	var coord = new this.window.papaya.core.Coordinate(coord[0], coord[1], coord[2]);
	this.window.papayaContainers[0].viewer.gotoWorldCoordinate(coord, false);
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
    loadFunction(index, images) {
	var that = this;
	if (index < images.length) {
	    var papayaImage = images[index];
	    var imageName = "image" + papayaImage.id //.replace(/-/g,"");
	    var image = papayaImage.image;

	    var config = $.extend({}, papayaImage.config, {loadingComplete: function() {
		that.loadFunction(index + 1, images);
	    } });

	    var imageParams = [];
	    imageParams[imageName] = config;	    
	    
	    this.addImage(imageName, image, imageParams);
	}
    }

};


var createFrame = function(parent) {
    var papayaFrame = new PapayaFrame(index, parent);
    index++;

    return papayaFrame;
}


module.exports = {
    createFrame
}
