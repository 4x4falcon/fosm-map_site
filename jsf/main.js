// main.js

// lat, lon and zoom are set in cookie.js

var view = new ol.View({
		center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
		zoom: zoom
		})

var mapQuestSource = new ol.source.MapQuest({layer: 'sat'});

var mapQuestSat = new ol.layer.Tile({
		source: mapQuestSource
		});


var fosmSource = new ol.source.OSM ({
			attribution: new ol.Attribution({
					        html: 'All maps &copy; <a href="http://fosm.org/">fosm.org</a>'}),
			url: 'http://10.0.0.33/default/{z}/{x}/{y}.png'
			});

var fosmTile = new ol.layer.Tile ({
		source: fosmSource,
		title: "Fosm"
		});


var layers = [
		fosmTile
		];

var map = new ol.Map({
	target: 'map',
	layers: layers,
	view: view
});


$(document).ready(
 setDisplay()
);


