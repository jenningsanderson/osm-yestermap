"use strict";

var tilebelt = require("../tilebelt/index.js");
var turfArea = require("@turf/area");

//Yesterday will only work with the latest planet file, for now just putting in a 2...
var yesterday = Math.floor( (Date.now()-(86400*2*1000) )/1000);
var last7     = Math.floor( (Date.now()-(86400*7*1000) )/1000);
var last30    = Math.floor( (Date.now()-(86400*30*1000) )/1000);

//Yesterday should be calculated 

module.exports = function(data, tile, writeData, done) {  
    
  var quadkey = tilebelt.tileToQuadkey(tile);

  var Y_z12Users = new Set();
  var W_z12Users = new Set();
  var M_z12Users = new Set();
    
  //Use turf to get the area of this tile
  var quadAreaKM = turfArea(tilebelt.tileToGeoJSON(tile))/1000000;
  
  //Process all of the features on this tile
  data['osm']['osm'].features.forEach(function(feat){
      
    //TODO: Split features to z15 ? NO!
      
    var ts = Number(feat.properties['@timestamp'])

    if (ts < last30){
        return
    }else if (ts > yesterday){
        Y_z12Users.add(feat.properties['@user'])
    }if (ts > last7){
        W_z12Users.add(feat.properties['@user'])
    }if (ts > last30){
        M_z12Users.add(feat.properties['@user'])
    }
    return; 
  });
    
  //Export this tile summary
  writeData(JSON.stringify({
    type       : 'Feature',
    tippecanoe : {minzoom: 7, maxzoom: 11},
    properties : {
      Y_users   : Y_z12Users.size,
      Y_users_norm   : Y_z12Users.size / quadAreaKM,
      W_users   : W_z12Users.size,
      W_users_norm   : W_z12Users.size / quadAreaKM,
      M_users   : M_z12Users.size,
      M_users_norm   : M_z12Users.size / quadAreaKM,
      area       : quadAreaKM,
    },
    geometry: tilebelt.tileToGeoJSON(tile)
  })+"\n")
  
  //Return the important features to reduce for further aggregation
  done(null, [ quadkey, {
      area: quadAreaKM,
      area_avg: [quadAreaKM], 
      Y_users: [...Y_z12Users],
      W_users: [...W_z12Users],
      M_users: [...M_z12Users] }])
};