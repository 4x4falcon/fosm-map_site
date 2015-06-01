<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <title>fosm.org - earth map</title>

<!--
     following (jquery and openlayers) are stored locally for testing purposes
     on map.fosm.org need to uncomment the http lines and comment out the local file lines
-->

<!--
        <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
-->
        <script src="ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<!--
        <script src="http://www.openlayers.org/api/OpenLayers.js"></script>
-->
        <script src="openlayers/OpenLayers.js"></script>


        <script src="jsf/fosm_org_functions.js"></script>
        <script src="jsf/fosm_org_2.js"></script>
        <script src="jsf/unverse10.02.js"></script>
        <script src="jsf/jump_to.js"></script>
        <script src="jsf/display_functions.js"></script>

        <link rel="stylesheet" href="/css/style.css" type="text/css">
        <link rel="stylesheet" href="/css/ol_style.css" type="text/css">


<!--
<style type="text/css">
.olControlAttribution { font-size:8pt; bottom: 30px !important; font-family:sans-serif; }
.olControlPermalink { font-size:8pt; font-family:sans-serif; }
</style>
-->

</head>

<body onload="init();setDisplay()" onunload="setCookie()" onresize="setDisplay()">
<iframe id="linkloader" name="linkloader" style="display:none"></iframe>

<div id="header">
 <img src="/images/fosm.png" height="43px"/>
</div>

<div id='cssmenu'>
<ul>
   <li class='active'><a id="map_fosm_org" href="#"><span>map</span></a></li>
   <li><a id="fosm_org" target="_blank" href="http://fosm.org"><span>Fosm</span></a></li>
   <li class='has-sub'><a href="javascript:void(0);"><span>Help</span></a>
      <ul>
         <li><a id="about_anchor" onclick="_.box('about');" title="About this server" href="javascript:void(0);"><span>About this server</span></a></li>
         <li class='last'><a id="help_info" onclick="_.box('help');" title="Help with the map" href="javascript:void(0);"><span>Help</span></a></li>
      </ul>
   <li class='has-sub'><a href="javascript:void(0);"><span>Edit</span></a>
      <ul>
         <li><a id="edit_in_josm" target="linkloader" href="javascript:void(0);"><span>edit in JOSM or Merkaartor</span></a></li>
         <li class='last'><a id="edit_in_potlatch" href="javascript:void(0);"><span>edit in Potlatch</span></a></li>
      </ul>
   </li>
<!--
   <li class='has-sub'><a href="javascript:void(0);"><span>Changesets</span></a>
      <ul>
         <li><a  id="changeset_anchor" href="javascript:void(0);"><span>fosm.org Changesets</span></a></li>
         <li class='last'><a id="changeset_2_anchor" href="javascript:void(0);"><span>openstreetmap.org Changesets</span></a></li>
      </ul>
   </li>
-->
   <li class='has-sub'><a href="javascript:void(0);"><span>Search</span></a>
      <ul>
         <li><a id="jump_to_anchor" onclick="_.box('jump_to');" href="javascript:void(0);"><span>jump to latitude/longitude</span></a></li>
         <li class='last'><a id="search_anchor" onclick="_.box('search');" href="javascript:void(0);"><span>Search</span></a></li>
      </ul>
   </li>
</ul>
</div>

     <div id="map"></div>

     <div id="about">
     <p class="heading">About this server</p>
     <p class="about_text">This is a Mapnik, postgresql server of the data available from <a class="about_text" href="http://fosm.org" target="_blank">fosm.org</a></p>
     <p class="about_text">The server has AMD 8150 Bulldozer eight core (3.6Ghz), 32 GB ram, 6Tb hdd.</p>
     <p class="about_text">The server is provided by me (Rosscoe), if you want more info contact me at info at 4x4falcon dot com</p>
     <p class="about_text">It is currently (1 May 2012) running Ubuntu 11.04 server, postgresql 8.4, Mapnik 2.0.1, apache 2.2 with mod_tile, plus numerous other tools to render maps.
     <p></p>
     </div>

     <div id="help">
     <p class="heading">Help</p>
     <p class="about_text">Additional map functions can be accessed by left clicking on the map.</p>
     <p class="about_text">Markerlink - creates a permalink with a marker at the position of the mouse click.</p>
     <p class="about_text">Permalink - creates a permalink at the position of the mouse click.</p>
     <p class="about_text">What's Here - shows items at the mouse click location (within a box 500m x 500m).</p>
     <p class="about_text">Changesets - shows changesets that include the mouse click location.</p>
     </div>

     <div id="jump_to">
     <p class="heading">
     Jump to latitude/longitude
     </p>
     <p class="about_text">Enter latitude and longitude below in decimal degrees (eg, -21.000,145.000)</p>
     <p class="about_text">Negative for south latitude and west longitude</p>

     <form class="about_text" name="jumpto" onsubmit="return jump_2()" method="GET" action="/">
     <p>
     Latitude: <input type="text" name="lat" /><br />
     </p>
     <p>
     Longitude: <input type="text" name="lon" /><br />
     </p>
     <input type="hidden" name="zoom" id="form_zoom" value="1" />
     <p>
     <input type="submit" value="Jump To" />
     </p>
     </form>
     </div>

     <div id="search">
     <p class="heading">Coming Soon</p>
     <p class="about_text">Nominatim search engine.</p>
     <p></p>
     </div>

     <div id="search_results">
     </div>

     <div id="popup_menu">
     <p class="about_text"><a id="markerlink" class="about_text" href="javascript:void(0);">MarkerLink</a></p>
     <p class="about_text"><a id="permalink" class="about_text" href="javascript:void(0);">PermaLink</a></p>
     <p class="about_text"><a id="whatshere" class="about_text" href="javascript:void(0);">What's Here</a></p>
     <p class="about_text"><a id="changeset" class="about_text" href="javascript:void(0);">Changesets</a></p>
     </div>

    </body>
</html>
