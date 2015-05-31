function setDisplay() {

	setPosition();
	setHeight();
	setWidth();
	updateHash();
}

function setPosition(left, top) {
	if (typeof(left)==='undefined') left = 0;
	if (typeof(top)==='undefined') top = 50;

	$('#map').left = left;
	$('#map').top = top;
}

function setHeight() {

}

function setWidth() {

	var width = $('body').width() - 20;

	$('#map').width(width);
}

/*
 *  Hash functions
 */

// the current hash can be modified by setCookie and update hash
// format is #map/zoom/lat/lon

var currentHash = "";

function getHash() {

	return location.hash.replace('#map/', '');

}


function updateHash() {



}


