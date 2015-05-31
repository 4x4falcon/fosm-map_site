// cookie.js

//initial setting for lat, lon and zoom
//can be modified by setCookie or updateHash

var lat = 0.0;
var lon = 140.0;
var zoom = 1;


// see there is a hash

currentHash = getHash();

if (currentHash != '') {

	console.log("currenthash = " + currentHash);

	bits = currentHash.split("/");
	zoom = parseInt(bits[0], 10);
	lat = parseFloat(bits[1], 10);
	lon = parseFloat(bits[2], 10);

	if (lat > 90.0) lat = 0;
	if (lat < -90.0) lat = 0;

	if (lon > 180.0) lat = 0;
	if (lon < -180.0) lat = 0;

	if (zoom < 0) zoom = 0;
	if (zoom > 19) zoom = 19;

	console.log("zoom = " + zoom + " lat = " + lat + " lon = " + lon);
 }



function setCookie() {

	var exdays = 7;						// expire after 7 days
	var cookieText = "";					// the cookie text

	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	cookieText = expires;

	cookieText += ";zoom=" + view.getZoom();

	var center = view.getCenter();

	cookieText += ";lat=" + center[0] + ";lon=" + center[1];

	console.log("cookie = " + cookieText);
}



