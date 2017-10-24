echo "Tiling"

../mason_packages/.link/bin/tippecanoe -Pf -Z0 -z11 -o yestermap.mbtiles \
  --named-layer=z12:ym-z12.geojsonl \
  --named-layer=z11:ym-z11.geojsonl \
  --named-layer=z10:ym-z10.geojsonl \
  --named-layer=z9:ym-z9.geojsonl  \
  --named-layer=z8:ym-z8.geojsonl  \
  --named-layer=z7:ym-z7.geojsonl  \
  --named-layer=z6:ym-z6.geojsonl   