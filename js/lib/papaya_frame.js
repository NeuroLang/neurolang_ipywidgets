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
        <div class="papaya" data-params="params"></div>
    </body>
</html>`;



var index = 0;

let PapayaFrame = class {
    constructor(index, parent) {
	this.frame = document.createElement("IFRAME");
	this.frame.name = "papaya_frame" + index;
	this.frame.srcdoc = papaya_src;
	this.frame.width="100%";
	this.frame.height="100%";
	this.index = index;

	var that = parent;
	this.frame.onload = function() {
	    that.init_frame();
	}

	parent.el.appendChild(this.frame);
    }

    // initializes window and 
    init() {
	this.window =  window[this.frame.name];
	this.container = this.window.papayaContainers[this.index];
	console.log(this.window);
    }

    add_atlas(atlas) {
	this.window.papaya.Atlas.data = atlas;
    }
    
    reset_viewer(params) {
	this.window.params = params;
	this.window.papaya.Container.resetViewer(this.index, params);
	this.container = this.window.papayaContainers[this.index];
    }

    update_params(params) {
	this.window.params = params;
//	this.container.params = params;
//	this.container.viewer.params = params;
//	this.container.readGlobalParams();
    }

    set_image(name, image) {
	this.window[name] = image;
	console.log(this.window);
    }

    add_image(imageRefs, params) {
	this.window.papaya.Container.addImage(this.index, imageRefs, params);
    }

    set_viewer_coordinates(params) {
	this.update_params(params);
	this.container.viewer.gotoCoordinate(params['coordinate'], true);
    }

};

var createFrame = function(parent) {
    var papaya_frame = new PapayaFrame(index, parent);
    index++;

    return papaya_frame;
}


module.exports = {
    createFrame
}
