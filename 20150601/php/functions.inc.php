<?php

function bounding_box ($lat, $lon, $bbox)
  {
//   echo "lat = " . $lat . " ";
//   echo "lon = " . $lon . "<br />";

   if (($lat == "") || ($lon == ""))
    {
     return false;
    }
   else
    {
     if (($lat < $bbox['top']) && ($lat > $bbox['bottom']) && ($lon > $bbox['left']) && ($lon < $bbox['right']))
      {
       return true;
      }
    }

   return false;
  }

?>
