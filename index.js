'use strict';

var fs = require('fs')
var path = require('path');
var tileReduce = require('@mapbox/tile-reduce');
var tilebelt = require("../tilebelt/index.js")
var _ = require("lodash");

var LowerZooms = require("../lib/lowerZoomAggregation.js")
var CustomTileStream = require("../lib/sortedStreamCover.js")

var config = {
  zoom: 12
}

config.sources = [
  {
    name: 'osm',
    mbtiles: path.join("/data/planet/latest.planet.mbtiles"),
    raw: false
  }
]

//Output Files: (Highest z level is logged to stdout, rest is procssed here:
var subZoomsLevels = {
  11:{
      file: fs.createWriteStream('ym-z11.geojsonl'),
      data: {}
    },
  10:{
      file: fs.createWriteStream('ym-z10.geojsonl'),
      data: {}
    },
  9:{
      file: fs.createWriteStream('ym-z9.geojsonl'),
      data: {}
    },
  8:{
      file: fs.createWriteStream('ym-z8.geojsonl'),
      data: {}
    },
  7:{
      file: fs.createWriteStream('ym-z7.geojsonl'),
      data: {}
    },
  6:{
      file: fs.createWriteStream('ym-z6.geojsonl'),
      data: {}
    }
}

var lowZoomAgg = new LowerZooms({
  minRender:6,
  zoomStep: 1,
  subZoomsLevels: subZoomsLevels,
  distinctCounts: ['Y_users', 'W_users', 'M_users'],
  sumProperties:  ['area'],
  avgProperties:  ['area_avg']
})

var tileStream = new CustomTileStream({
  dir: "../filters/USA/",
  zoom: 12 
})

config.tileStream = tileStream.createStreamFromGeoJSON("../filters/world.geojson", true)

//config.tileStream = tileStream.createMultiPolygonStream();

tileReduce(Object.assign({
  map: path.join(__dirname, '/yestermap-map.js')
  },config)
)
.on('reduce', function(res) {
  //Process the result (quadkey, data)
  lowZoomAgg.processTile(res[0], res[1])

})
.on('end', function() {
  //On end, empty out any subQuadkeys which aren't yet complete: 
  lowZoomAgg.flushRemaining();
  console.error("DONE")
});