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

require("../css/styles.css");

var index = 0;

let ColorBar = class {
    constructor(height, width) {
	this.height = height;
	this.width = width;
	
	// create colorbar
	var div = document.createElement('div');
	div.id = "colorBar"
	this.colorBar = div;

	var div = document.createElement('div');
	div.id = "image-div"
	div.style.width="80%";
	div.style.height = "100%";
	div.style.position = "absolute";
	div.style.left = "10%";

	this.divMin = document.createElement('div');
	this.divMin.id = "min-div";
	this.divMin.classList.add("values", "minValue");

	this.divImg = document.createElement("IMG");
	this.divImg.style.width = "100%";
	this.divImg.style.height = "100%";

	this.divMax = document.createElement('div');
	this.divMax.id = "max-div";
	this.divMax.classList.add("values", "maxValue");
	
	div.appendChild(this.divMin);
	div.appendChild(this.divImg);
	div.appendChild(this.divMax);
	
	this.colorBar.appendChild(div);
    }

    getDiv() {
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

}

let PapayaFrame = class {
    /**
     * Creates a new frame and puts the papaya viewer inside the frame
     * to isolate it from the main window.
     *
     * index: index of the frame.
     * parentView: PapayaView instance that contains this frame.
     */
    constructor(index, parentView, colorBar) {
	this.name = "papayaFrame" + index;
	this.index = index;

	var papayaFrameDiv = document.createElement('div')
	papayaFrameDiv.style.width = "100%";
	papayaFrameDiv.style.height = "100%";
	papayaFrameDiv.id = "papaya-viewer";

	// create frame for papaya viewer
	var frameElement = document.createElement("IFRAME");
	frameElement.srcdoc = papaya_src;
	frameElement.name = this.name;
	frameElement.style.width="100%";
	frameElement.style.height="100%";
	frameElement.style.display = "inline-block";

	this.colorBar = colorBar;
	
	papayaFrameDiv.appendChild(frameElement);
	papayaFrameDiv.appendChild(this.colorBar.getDiv());
	
	this.papayaFrameDiv = papayaFrameDiv;
	
	var that = parentView;
	frameElement.onload = function() {
	    that.initFrame();
	}

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

    setColorBar(index) {
	if (index < this.window.papayaContainers[0].viewer.screenVolumes.length) {
	    this.colorBar.setMin(this.window.papayaContainers[0].viewer.screenVolumes[index].screenMin.toFixed(2));
	    
	    this.colorBar.setMax(this.window.papayaContainers[0].viewer.screenVolumes[index].screenMax.toFixed(2));

	    this.colorBar.setImageSrc(this.window.papayaContainers[0].viewer.screenVolumes[index].colorBar);
	}
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
		if (index == 0) {
		    that.setColorBar(index+1);
		}
		that.loadFunction(index + 1, images);
	    } });

	    var imageParams = [];
	    imageParams[imageName] = config;	    
	    
	    this.addImage(imageName, image, imageParams);
	}
    }

};



var createFrame = function(parentView, height, width) {
    let colorBar = new ColorBar(height, width);
    var papayaFrame = new PapayaFrame(index, parentView, colorBar);
    index++;

    return papayaFrame;
}


module.exports = {
    createFrame
}
