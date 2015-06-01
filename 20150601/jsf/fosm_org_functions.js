/*
Javascript functions for fosm.org render
*/

var epsg4326 = new OpenLayers.Projection("EPSG:4326");
var edit_zoom = 14;

/*
 * Called to interpolate JavaScript variables in strings using a
 * similar syntax to rails I18n string interpolation - the only
 * difference is that [[foo]] is the placeholder syntax instead
 * of {{foo}} which allows the same string to be processed by both
 * rails and then later by javascript.
 */
function i18n(string, keys) {
  string = i18n_strings[string] || string
  for (var key in keys) {
    var re_key = '\\[\\[' + key + '\\]\\]';
    var re = new RegExp(re_key, "g");
    string = string.replace(re, keys[key]);
  }
  return string;
}

/*
i18n strings
*/

i18n_strings = new Array();
i18n_strings['javascripts.site.edit_disabled_tooltip'] = 'Zoom in to edit the map';
i18n_strings['javascripts.site.history_disabled_tooltip'] = 'Zoom in to view edits for this area';
i18n_strings['javascripts.site.edit_zoom_alert'] = 'You must zoom in to edit the map';
i18n_strings['javascripts.site.edit_tooltip_josm'] = 'Edit the map in Josm or Merkaartor';
i18n_strings['javascripts.site.edit_tooltip_potlatch'] = 'Edit the map in Potlatch 2';
i18n_strings['javascripts.site.history_zoom_alert'] = 'You must zoom in to view edits for this area';
i18n_strings['javascripts.site.history_tooltip'] = 'View edits for this area';
//i18n_strings['javascripts.site._tooltip'] = 'View  for this area';
i18n_strings['javascripts.site.fosm_changeset_tooltip'] = 'View fosm.org changesets for this area';
i18n_strings['javascripts.site.osm_changeset_tooltip'] = 'View osm changesets for this area';
i18n_strings['javascripts.site.about_tooltip'] = 'About this server';
i18n_strings['javascripts.site.search_nominatim_tooltip'] = 'Search in nominatim for locations, addresses, etc';

i18n_strings['javascripts.map.overlays.maplint'] = 'Maplint';
i18n_strings['javascripts.map.base.noname'] = 'NoName';
i18n_strings['javascripts.map.base.cycle_map'] = 'Cycle Map';
i18n_strings['javascripts.map.base.mapnik'] = 'Mapnik';
i18n_strings['javascripts.map.base.osmarender'] = 'Osmarender';

/*
 * Called to set the arguments on a URL from the given hash.
 */
function setArgs(url, args) {
   var queryitems = new Array();
   for (arg in args)
   {
      if (args[arg] == null) {
         queryitems.push(escape(arg));
      } else {
         queryitems.push(escape(arg) + "=" + encodeURIComponent(args[arg]));
      }
   }
   return url.replace(/\?.*$/, "") + "?" + queryitems.join("&");
}


function updateLinks() {
  var lonlat = map.getCenter().clone().transform(map.getProjectionObject(), epsg4326);
  var zoom = map.getZoom();
  var bounds = map.getExtent();
  var wgs84_bounds = bounds.toGeometry().transform(map.getProjectionObject(), map.displayProjection).getBounds();
  var fosmorg = 'http://fosm.org';
  var pine_fosmorg ='http://pine02.fosm.org';
  var josm = 'http://localhost:8111/load_and_zoom?';
  var node;
  var decimals = Math.pow(10, Math.floor(zoom/3));
  lat = Math.round(lonlat.lat * decimals) / decimals;
  lon = Math.round(lonlat.lon * decimals) / decimals;


//  alert ('zoom = ' + zoom);

  node = $("#edit_in_josm");                        // editanchor
  if (node) {

//  alert ('edit_in_josm');

    if (zoom >= edit_zoom) {
      var args = new Object();
      args.left = wgs84_bounds.left;
      args.right = wgs84_bounds.right;
      args.top = wgs84_bounds.top;
      args.bottom = wgs84_bounds.bottom;
      node.href = setArgs(josm+"/edit", args);
      args.bbox = wgs84_bounds.left+','+wgs84_bounds.bottom+','+wgs84_bounds.right+','+wgs84_bounds.top;

      node.attr({
                 "href" : 'javascript:void(0)',
                 "onclick" : 'remoteEditHandler();',
                 "title" : i18n("javascripts.site.edit_tooltip_josm"),
                 "target" : "linkloader"
               });
    } else {
      node.attr({
                 "href" : 'javascript:alert(i18n("javascripts.site.edit_zoom_alert"));',
                 "title" : i18n("javascripts.site.edit_disabled_tooltip"),
                 "target" : ""
               });
//                 "onclick" : 'alert(i18n("javascripts.site.edit_zoom_alert"))',
    }
  }


  node = $("#edit_in_potlatch");                        // editanchor
  if (node) {
    if (zoom >= edit_zoom) {
      var args = new Object();
      args.lat = lat;
      args.lon = lon;
      args.zoom = zoom;
      node.attr({
                 "href" : setArgs(fosmorg+"/edit", args),
                 "title" : i18n("javascripts.site.edit_tooltip_potlatch"),
                 "target" : '_blank'
                });
    } else {
      node.attr({
                 "href" : 'javascript:alert(i18n("javascripts.site.edit_zoom_alert"));',
                 "title" : i18n("javascripts.site.edit_disabled_tooltip"),
                 "target" : ""
               });
    }
  }


/*
http://pine02.fosm.org/rss/bboxfilter.cgi?bbox=20.271,42.06,21.804,43.125
                                               top, right, bottom, left
*/


/*
  node = $("changeset_anchor");
  if (node) {
      var args = new Object();
      args.bbox = wgs84_bounds.left+','+wgs84_bounds.bottom+','+wgs84_bounds.right+','+wgs84_bounds.top;
      node.attr({
                 "href" : setArgs(pine_fosmorg+"/rss/bboxfilter.cgi", args),
                 "target" : '_blank',
                 "title" : i18n("javascripts.site.fosm_changeset_tooltip")
                });
   }
*/
/*
  node = $("changeset_2_anchor");
  if (node) {
      var args = new Object();
      args.bbox = wgs84_bounds.left+','+wgs84_bounds.bottom+','+wgs84_bounds.right+','+wgs84_bounds.top;
      node.attr({
                 "href" : setArgs("http://www.openstreetmap.org/browse/changesets/feed", args),
                 "target" : '_blank',
                 "title" : i18n("javascripts.site.osm_changeset_tooltip")
                });
   }
*/

/*
  node = $("exportanchor");
  if (node) {
    var args = getArgs(node.href);
    args["lat"] = lat;
    args["lon"] = lon;
    args["zoom"] = zoom;
    node.href = setArgs(node.href, args);
  }
*/

/*
  node = $("historyanchor");
  if (node) {
    if (zoom >= 13) {
      var args = new Object();
      args.lat = lat;
      args.lon = lon;
      args.zoom = zoom;
      node.href = setArgs("http://matt.dev.openstreetmap.org/owl_viewer/weeklymap", args);
      node.title = i18n("javascripts.site.history_tooltip");
    } else {
      node.href = 'javascript:alert(i18n("javascripts.site.history_zoom_alert"));';
      node.title = i18n("javascripts.site.history_disabled_tooltip");
    }
  }

  node = $("compareanchor");
  if (node) {
    var args = getArgs(node.href);
    args["lat"] = lat;
    args["lon"] = lon;
    args["zoom"] = zoom;
    node.href = setArgs(node.href, args);
  }
*/
  node = $("form_zoom")
  if (node) {
      node.attr({
                 "value" : zoom
               });
  }

}

/*
Set the cookie before exiting the page
*/

function setCookie()

 {
  var lonlat = map.getCenter().clone().transform(map.getProjectionObject(), epsg4326);
  var cookietext = cookiename+"="+lonlat.lat+"|"+lonlat.lon+"|"+map.getZoom()+"|"+getActiveLayers();
  if (expiredays)
   {
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    cookietext += ";expires="+exdate.toGMTString();
   }
  document.cookie=cookietext;
 }


/*
show an item
*/

function showItem(id)

 {
  if (document.getElementById)
   {                                            // DOM3 = IE5, NS6
    document.getElementById(id).style.visibility = 'visible';
   }
  else
   {
    if (document.layers)
     {                                          // Netscape 4
      document.id.visibility = 'visible';
     }
    else
     {                                          // IE 4
      document.all.id.style.visibility = 'visible';
     }
   }
 }

/*
hide an item
*/

function hideItem(id)

 {
  if (document.getElementById)
   {                                            // DOM3 = IE5, NS6
    document.getElementById(id).style.visibility = 'hidden';
   }
  else
   {
    if (document.layers)
     {                                          // Netscape 4
      document.id.visibility = 'hidden';
     }
    else
     {                                          // IE 4
      document.all.id.style.visibility = 'hidden';
     }
   } 
 }


/*
 Returns a string representation of layers in map
*/

function getActiveLayers() {
  var layers = '';
  for (var i=0; i< map.layers.length; i++) {
    var layer = map.layers[i];
    if (layer.isBaseLayer) {
      layers += (layer == map.baseLayer) ? "B" : "0";
    } else {
      layers += (layer.getVisibility()) ? "T" : "F";
    }
  }
  return layers;
}

/*
 Reads a string like the one getActiveLayers makes and
 sets the active layers correspondingly
*/

function setActiveLayers(layers) {
  for(var i=0; i < layers.length; i++) {
    var layer = map.layers[i];
    var c = layers.charAt(i);
    if (c == "B") {
        map.setBaseLayer(layer);
    } else if ( (c == "T") || (c == "F") ) {
        layer.setVisibility(c == "T");
    }
  }
}

function getMapExtent()
  {
   return map.getExtent().clone().transform(map.getProjectionObject(),epsg4326);
  }


function installEditHandler ()
 {
//  $("#edit_in_josm").observe("click", alert('clicked'));
//  $("#edit_in_josm").click(remoteEditHandler());
 }


//function remoteEditHandler(bbox, select)
function remoteEditHandler()
 {
/*
  var left = bbox.left - 0.0001;
  var top = bbox.top + 0.0001;
  var right = bbox.right + 0.0001;
  var bottom = bbox.bottom - 0.0001;
  var loaded = false;
*/
  var bounds = getMapExtent();
  var zoom = map.getZoom();
  var left = bounds.left - 0.0001;
  var top = bounds.top + 0.0001;
  var right = bounds.right + 0.0001;
  var bottom = bounds.bottom - 0.0001;
  var loaded = false;

  if (zoom < edit_zoom)
   {
    alert ('Zoom in to edit');
    return;
   }
  
  $("#linkloader").load(function () { loaded = true; });

/*
  if (select)
   {
    $("#linkloader").attr("src", "http://127.0.0.1:8111/load_and_zoom?left=" + left + "&top=" + top + "&right=" + right + "&bottom=" + bottom + "&select=" + select);
   }
  else
   {
*/
    $("#linkloader").attr("src", "http://127.0.0.1:8111/load_and_zoom?left=" + left + "&top=" + top + "&right=" + right + "&bottom=" + bottom);
/*
   }
*/

  setTimeout(function ()
   {
    if (!loaded) alert("Editing failed - make sure JOSM or Merkaartor is loaded and the remote control option is enabled");
   }, 1000);

  return false;
 }




/*
// Use cookies to remember last map view
var cookiename = "fosmView";  // Name for this cookie
var expiredays = 7;          // Number of days before cookie expiry
// Look for the cookie
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
    zoom = zoom - 1;
    layers = bits[3];
   }
  }
*/

// Function to convert normal latitude/longitude to mercator easting/northings
function lonLatToMercator(ll)
 {
  var lon = ll.lon * 20037508.34 / 180;
  var lat = Math.log (Math.tan ((90 + ll.lat) * Math.PI / 360)) / (Math.PI / 180);
  lat = lat * 20037508.34 / 180;
  return new OpenLayers.LonLat(lon, lat);
 }

