/*
This is the initialization and cookie functions for fosm.org render
*/

// make map available for easy debugging

var map;

var lat = 0.00;       // -26.00
var lon = 140.00;     // 135.00
var zoom = 1;         // 4
var fosm = 'Data CC-By-SA by <a target="_blank" href="http://fosm.org/">fosm.org</a>';
var layers = '';

// Change this to '' if local tile server 
//var server = 'http://map.fosm.org';
var server = '';

// Read marker position
var mlon = getQueryVariable("mlon");
var mlat = getQueryVariable("mlat");

function getQueryVariable(variable)
 {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++)
   {
    var pair = vars[i].split("=");
    if (pair[0] == variable)
     {
      return pair[1];
     }
   }
 }

var testing = getQueryVariable("testing");



// Use cookies to remember last map view
var cookiename = "fosmView";  // Name for this cookie
var expiredays = 7;          // Number of days before cookie expiry
// Look for the cookie
// If lon and lat parameters aren't explicitly specified, default to
// the marker position
if (mlon !== undefined && mlat !== undefined)
 {
  lon = getQueryVariable("mlon");
  lat = getQueryVariable("mlat");
  zoom = getQueryVariable("zoom");
 }
else
 {
  if (document.cookie.length>0)
   {
    cookieStart = document.cookie.indexOf(cookiename + "=");
    if (cookieStart!=-1)
     {
      cookieStart += cookiename.length+1;
      cookieEnd=document.cookie.indexOf(";",cookieStart);
      if (cookieEnd==-1)
       {
        cookieEnd=document.cookie.length;
       }
      cookietext = document.cookie.substring(cookieStart,cookieEnd);
// Split the cookie text and create the variables
      bits = cookietext.split("|");
      lat = parseFloat(bits[0]);
      lon = parseFloat(bits[1]);
      zoom = parseInt(bits[2]);
      zoom = zoom;
      layers = bits[3];
     }
   }
 }

// avoid pink tiles

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
OpenLayers.Util.onImageLoadErrorColor = "transparent";
OpenLayers.Util.MISSING_TILE_URL = "/images/404.png";

function init()
 {
  var options = {
                projection: new OpenLayers.Projection("EPSG:900913"),
                displayProjection: new OpenLayers.Projection("EPSG:4326"),
                units: "m",
                maxResolution: 156543.0339,
                maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
                controls:[], numZoomLevels:19
               };

  map = new OpenLayers.Map('map', options);

  map.addLayers([

/*
fosm.org mapnik layer
*/

          new OpenLayers.Layer.TMS( "FOSM Mapnik", server+"/default/",
            { type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true,
              attribution: 'Map data &copy; <a href="http://www.fosm.org/">fosm.org</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
              isBaseLayer: true, visibility: true, numZoomLevels:19, 'displayInLayerSwitcher':true } ),

/*
fosm.org carto mapnik layer
*/

          new OpenLayers.Layer.TMS( "FOSM Mapnik Carto", server+"/carto/",
            { type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true,
              attribution: 'Map data &copy; <a href="http://www.fosm.org/">fosm.org</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
              isBaseLayer: true, visibility: true, numZoomLevels:19, 'displayInLayerSwitcher':true } ),

/*
fosm.org black and white mapnik layer
*/

          new OpenLayers.Layer.TMS( "FOSM Mapnik Monochrome", server+"/fosm-bw/",
            { type: 'png', getURL: osm_getTileURL, displayOutsideMaxExtent: true,
              attribution: 'Map data &copy; <a href="http://www.fosm.org/">fosm.org</a> and contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
              isBaseLayer: true, visibility: true, numZoomLevels:19, 'displayInLayerSwitcher':true } ),

/*
noname overlay
*/

          new OpenLayers.Layer.OSM("noname", server+"/noname/${z}/${x}/${y}.png",
           { attribution: '',
             isBaseLayer: false,
             visibility: false,
             numZoomLevels: 7,
             minScale: 100000
           })

/*
shopping overlay
*/
/*
,          new OpenLayers.Layer.OSM("shopping", "/shopping/${z}/${x}/${y}.png",
                     {
                      attribution: '',
                      isBaseLayer: false,
                      visibility: false,
                      numZoomLevels:19
                     })
*/
        ]);

  if (testing == 1)
   {
/*
testing overlay
*/

    map.addLayers([

          new OpenLayers.Layer.OSM("testing", server+"/testing/${z}/${x}/${y}.png",
           {
            attribution: '',
            isBaseLayer: false,
            visibility: false,
            numZoomLevels: 7,
            minScale: 100000
           })
    ]);
   }


// Add the marker if mlon and mlat are defined

  if (mlon !== undefined && mlat !== undefined) {
    var markers = new OpenLayers.Layer.Markers("Marker",
      {displayInLayerSwitcher: false});
    map.addLayer(markers);
    var marker = new OpenLayers.Marker(new OpenLayers.LonLat(mlon, mlat).
      transform(new OpenLayers.Projection("EPSG:4326"),
                new OpenLayers.Projection("EPSG:900913")));
    markers.addMarker(marker);
  }


  map.addControl(new OpenLayers.Control.ArgParser());
  map.addControl(new OpenLayers.Control.Attribution());
  var layerswitcher = new OpenLayers.Control.LayerSwitcher();
  map.addControl(layerswitcher);
  map.addControl(new OpenLayers.Control.Navigation());
  map.addControl(new OpenLayers.Control.PanZoomBar() );
  map.addControl(new OpenLayers.Control.Permalink('Perma'));
  map.addControl(new OpenLayers.Control.ScaleLine());
  map.addControl(new OpenLayers.Control.MousePosition());

  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();

  if( ! map.getCenter() )
   {
    var lonLat = new OpenLayers.LonLat(lon, lat).transform(epsg4326, map.getProjectionObject());
    map.setCenter(lonLat, zoom);
    if (layers)
     {
      setActiveLayers(layers);
     }
   }

   updateLinks();
   map.events.register("moveend", map, updateLinks);
   if (layers)
    {
     map.events.register("changelayer", map, updateLinks);
    }

/*
this is in format
w=1173,h=549
attempt to move layerswitcher

  var map_size = map.size.toString().split(",");

  var tmp = map_size[0].split("=");

  var map_width = tmp[1];

  tmp = map_size[1].split("=");

  var map_height = tmp[1];

  layerswitcher.moveTo(new OpenLayers.Pixel(parseFloat(map_width) - 150, 125));

//  alert (map_size+" w = "+map_width+" h = "+map_height);
*/
  installEditHandler();

 }



function osm_getTileURL(bounds)
 {
  var res = this.map.getResolution();
  var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
  var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
  var z = this.map.getZoom();
  var limit = Math.pow(2, z);

  if (y < 0 || y >= limit)
   {

//    alert (OpenLayers.Util.getImagesLocation());
//    return OpenLayers.Util.getImagesLocation() + "404.png";
    return "/images/404.png";
   }
  else
   {
    x = ((x % limit) + limit) % limit;
    return this.url + z + "/" + x + "/" + y + "." + this.type;
   }
 }

/*
function getMQURL(bounds)
 {
  var res = this.map.getResolution();
  var x = Math.round ((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
  var y = Math.round ((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
  var z = this.map.getZoom();
  var limit = Math.pow(2, z);
  if (y < 0 || y >= limit)
   {
    return null;
   }
  else
   {
    x = ((x % limit) + limit) % limit;
    var path = z + "/" + x + "/" + y + "." + this.type;
    var url = this.url;
    if (url instanceof Array)
     {
      url = this.selectUrl(path, url);
     }
    return url + path;
   }
 }
*/


  OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
    defaultHandlerOptions: {
      'single': true,
      'double': false,
      'pixelTolerance': 0,
      'stopSingle': false,
      'stopDouble': false
      },

    initialize: function(options) {
      this.handlerOptions = OpenLayers.Util.extend(
       {}, this.defaultHandlerOptions
      );

    OpenLayers.Control.prototype.initialize.apply(
      this, arguments
      ); 

    this.handler = new OpenLayers.Handler.Click(
      this, {
             'click': this.trigger
            }, this.handlerOptions
      );
     },

    trigger: function(e) {

      var zoom = map.getZoom();
      var lonlat = map.getLonLatFromPixel(e.xy).clone().transform(map.getProjectionObject(), epsg4326);
//      alert("You clicked near " + lonlat.lat + " " + lonlat.lon + " zoom is " + zoom);

      _.box('popup_menu',250,140);

      $("#markerlink").attr ({
                             "href" : "/?mlon=" + lonlat.lon + "&mlat=" + lonlat.lat + "&zoom=" + zoom + "&layers=" + getActiveLayers(),
                             "title" : "Create a marker here"
                            }); 
      $("#permalink").attr ({
                             "href" : "/?lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&zoom=" + zoom + "&layers=" + getActiveLayers()
                            }); 
      $("#whatshere").attr ({
                             "href" : "javascript:_.box('http://map/whatshere/?lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&zoom=" + zoom + "&layers=" + getActiveLayers() + "',800);"
                            }); 
/*
      $("#changeset").attr ({
                             "href" : "javascript:_.box('http://map/whatshere/?lon=" + lonlat.lon + "&lat=" + lonlat.lat + "&zoom=" + zoom + "&layers=" + getActiveLayers() + "',800);"
                            }); 
*/
      
     }

   });

