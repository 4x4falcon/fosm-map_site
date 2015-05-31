//window.onresize = setMapHeight;

/* put functions to be performed on setDisplay call here */

function setDisplay()
  {
   setMapHeight();
   setMapWidth();
  }

/* set the height of the map div, takes into account height of cssmenu div */

function setMapHeight()
  {
   var iH = window.innerHeight - document.getElementById("cssmenu").offsetHeight;

   document.getElementById("map").style.height = iH+"px";
  }

/* set the width of the map div, not used as at 3 May 2013 */

function setMapWidth()
  {
  }
