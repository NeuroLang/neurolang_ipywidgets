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
	frameElement.onload = function() {
	    console.log(this);
	    that.initFrame();
	}

	var that = parent;
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
	console.log(params);
	this.window =  window[this.name];
	this.container = this.window.papayaContainers[this.index];

	this.setImage("atlas", atlas_image);
	this.resetViewer(params);
	console.log(this.window);
    }

    /**
     * Updates window parameters and resets the viewer with params.
     * 
     * params: papaya parameters to be set.
     */
    resetViewer(params) {
	this.window.params = params;
	this.window.papaya.Container.resetViewer(this.index, params);
    }

    /**
     * Updates parameters.
     * 
     * params: papaya parameters to be set. 
     * 
     * Note: This does not update the view with the params set.
     */
    updateParams(params) {
	this.window.params = params;
	this.container.readGlobalParams();
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

    add_image(imageRefs, params) {
	this.window.papaya.Container.addImage(this.index, imageRefs, params);
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
