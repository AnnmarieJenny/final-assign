mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ubWFyaWVqZW5ueSIsImEiOiJja2w4NGUycWMydHVnMnBwbGtwYTd2bDdsIn0.nw5eYr-3jZj6cS7lDUIFMg';

var map = new mapboxgl.Map ({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-118.182114,33.777613],
    zoom: 10.5
});

// a helper function for looking up colors and descriptions for NYC land use codes
var LandUseLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#f4f455',
        description: 'Residential',
      };
    case 2:
      return {
        color: '#ea6661',
        description: 'Commercial',
      };
    case 3:
      return {
        color: '#d36ff4',
        description: 'Industrial',
      };
    case 4:
      return {
        color: '#5CA2D1',
        description: 'Institutional',
      };
    case 5:
      return {
        color: '#8ece7c',
        description: 'Park',
      };
    case 6:
      return {
        color: '#dac0e8',
        description: 'Public Right-of-Way',
      };
    case 7:
      return {
        color: '#f79f79',
        description: 'Planned Development',
      };
    case 8:
      return {
        color: '#EE85B5',
        description: 'Specific Plan',
      };
    case 9:
      return {
        color: '#f7cabf',
        description: 'Mixed Use',
      };
    case 10:
      return {
        color: '#f7f7f7',
        description: 'Not Zoned',
      };
  }
};



// a helper function for looking up colors and descriptions for NYC land use codes
var FloodZoneLookup = (code) => {
  switch (code) {
    case 1:
      return {
        color: '#0c2c84',
        description: '1% Annual Chance of Flooding [Mandatory Flood Insurance Required]',
      };
    case 2:
      return {
        color: '#225ea8',
        description: 'Base Flood Plain [Mandatory Flood Insurance Required]',
      };
    case 3:
      return {
        color: '#41b6c4',
        description: '1% Annual Chance of Shallow Flooding',
      };
    case 4:
      return {
        color: '#1d91c0',
        description: '1% Chance or Greater of Flooding & An Annual Hazard Associated with Wave Storms [Mandatory Flood Insurance Required]',
      };
    case 5:
      return {
        color: '#95dedb',
        description: 'Moderate Flood Hazard; Area between limits of the 100-year and 500-year floods',
      };
    case 6:
      return {
        color: '#c5edeb',
        description: '0.2% Annual Chance of Flooding',
      };
    case 7:
      return {
        color: '#ffffcc',
        description: 'Other',
        };
  }
};

//add in map zoom in and zoom out feature
var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');

map.on('load', function(){ // or style-load ??
    // add source and layer for long beach outline
    // primary layer (1 of 3)
    map.addSource('long-beach', {
        type: 'geojson',
        data: 'data/long-beach.geojson'
    });
    map.addLayer({
        'id': 'long-beach',
        'type': 'fill',
        'source': 'long-beach',
        'layout': {
          'visibility':'none'
        },
        'paint': {
          'fill-color': 'yellow',
          'fill-opacity': 0.5
        }
    });
    // add source and layer for land use zoning
    // primary layer 2 of 3
    map.addSource('land-uses', {
        type: 'geojson',
        data: 'data/land-uses.geojson'
    });

    // create vars to prep for variety of colors
    map.addLayer({
        'id': 'land-uses',
        'type': 'fill',
        'source': 'land-uses',
        'layout': {
        },
        'paint': {
          'fill-color': {
        type: 'categorical',
        property: 'GENERAL_CL',
        stops: [ // if time permits try to consolidate since both this and the var above use numeric
          [
            100,
            LandUseLookup(1).color,
          ],
          [
            200,
            LandUseLookup(2).color,
          ],
          [
            300,
            LandUseLookup(3).color,
          ],
          [
            400,
            LandUseLookup(4).color,
          ],
          [
            500,
            LandUseLookup(5).color,
          ],
          [
            600,
            LandUseLookup(6).color,
          ],
          [
            700,
            LandUseLookup(7).color,
          ],
          [
            800,
            LandUseLookup(8).color,
          ],
          [
            1100,
            LandUseLookup(9).color,
          ],
          [
            999,
            LandUseLookup(10).color,
          ],
        ]
      },
      'fill-outline-color': '#ccc', // can make wider, etc.
      'fill-opacity':1
    }
  });
    // add source and layer for poverty rate
    // primary layer (3 of 3)
    map.addSource('pov-rate', {
        type: 'geojson',
        data: 'data/pov.geojson'
    });
    map.addLayer({
        'id': 'pov-rate',
        'type': 'fill',
        'source': 'pov-rate',
        'layout': {
          'visibility':'none'
        },
        'paint': {
          'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'ACS_POV2_1'],
          0,
          '#f2f0f7',
          13,
          '#cbc9e2',
          26,
          '#9e9ac8',
          39,
          '#756bb1',
          52,
          '#54278f'
        ],
          'fill-opacity': 1,
          'fill-outline-color': '#cccccc', // can make wider, etc.
        }
    })
    // add source and layer for flood zones
    // supplemental layer (1 of 2)
    map.addSource('flood-zones', {
        type: 'geojson',
        data: 'data/floods.geojson'
    });
    map.addLayer({
        'id': 'flood-zones',
        'type': 'fill',
        'source': 'flood-zones',
        'layout': {
          'visibility':'none'
        },
        'paint': {
          'fill-color': {
          type: 'categorical',
          property: 'ZONE_TYPE',
          stops: [ // if time permits try to consolidate since both this and the var above use numeric
            [
              'A',
              FloodZoneLookup(1).color,

            ],
            [
              'AE',
              FloodZoneLookup(2).color,
            ],
            [
              'AH',
              FloodZoneLookup(3).color,
            ],
            [
              'VE',
              FloodZoneLookup(4).color,
            ],
            [
              'X',
              FloodZoneLookup(5).color,
            ],
            [
              'X 0.2',
              FloodZoneLookup(6).color,
            ],
            [
              '',
              FloodZoneLookup(7).color,
            ],
          ]
        },
        'fill-outline-color': '#ccc', // can make wider, etc.
        'fill-opacity':0.7
      }
    });
    // add source and layer for liquefaction zones (caused by EQs)
    // supplemental layer (2 of 2)
    map.addSource('liquefaction-zone', {
        type: 'geojson',
        data: 'data/liquefaction.geojson'
    });
    map.addLayer({
        'id': 'liquefaction-zone',
        'type': 'fill',
        'source': 'liquefaction-zone',
        'layout': {
        },
        'paint': {
          'fill-outline-color': '#ccc', // can make wider, etc.
          'fill-color': 'lightgreen',
          'fill-opacity': 0.5
        }
    });

    $('.layer-toggle').change(function() {
      const layerId = $(this).attr('id')
      if ($(this).is(':checked')) {
        map.setLayoutProperty(layerId, 'visibility', 'visible');
      } else {
        map.setLayoutProperty(layerId, 'visibility', 'none');
      }
    });



var popup = new mapboxgl.Popup({
  closeOnClick: false
})

/*var landuseDescription = map.queryRenderedFeatures(e.point, {
  layers: ['land-uses'],
  [
    100,
    LandUseLookup(1).description,
  ],
  [
    200,
    LandUseLookup(2).description,
  ],
  [
    300,
    LandUseLookup(3).description,
  ],
  [
    400,
    LandUseLookup(4).description,
  ],
  [
    500,
    LandUseLookup(5).description,
  ],
  [
    600,
    LandUseLookup(6).description,
  ],
  [
    700,
    LandUseLookup(7).description,
  ],
  [
    800,
    LandUseLookup(8).description,
  ],
  [
    1100,
    LandUseLookup(9).description,
  ],
  [
    999,
    LandUseLookup(10).description,
  ],
]});*/

// Popup for LandUse
// create pop up with multiple properties listed below
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['land-uses'],
  });
console.log(features)

if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature

  var hoveredFeature = features[0]// problem here? possible there are overlapping features?
  var landuseDescription = hoveredFeature.properties.GENERAL_CL
  // LandUseLookup(hoveredFeature.properties.GENERAL_CL).description
  var popupContent = `
      <div>
        ${landuseDescription}
      </div>
  `
// The code needs to be given indication elsewhere besides the paint area
// of what the case 1 - 10 translate to in terms of GENERAL_CL Land Use codes

  popup.setLngLat(e.lngLat).setHTML(landuseDescription).addTo(map);
} else{
  // remove pop up if there are not queryRenderedFeatures
  popup.remove();
}

})

// Popup for Pov Rate (2016)
// create pop up with multiple properties listed below
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['pov-rate'],
  });
console.log(features)

if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature

  var hoveredFeature = features[0]
  var popupContent = `
      <div>
        <b>Poverty Rate: </b>${hoveredFeature.properties.ACS_POV2_1}%
      </div>`
  popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
    } else{
  // remove pop up if there are not queryRenderedFeatures
  popup.remove();
    }
    })

// Popup for Flood Zones
// create pop up with multiple properties listed below
map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['flood-zones'],
    });
  console.log(features)

  if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature
  var hoveredFeature = features[0]
  var popupContent = `
    <div>
      <b>Poverty Rate: </b>${hoveredFeature.properties.ACS_POV2_1}%
   </div>`
   popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
      } else{
  // remove pop up if there are not queryRenderedFeatures
    popup.remove();
     }
   })




  // use function (VacantLots) from above to create a var that pulls from that data
  /*var myHTML1 = `
      <div><b>Land Use Type: </b>${LandUseLookup.description}</div>
      `
  new mapboxgl.Popup()
    .setLngLat(e.lngLat)
    .setHTML(myHTML1)
    .addTo(map);
  });*/

  // create pop up with multiple properties listed below
  /*map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['long-beach','pov-rate', 'flood-zones', 'liquefaction-zone']
    });})

    var myHTML = `
        <div><b>Name: </b>${features[0].properties.Name}</div>
        `
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(myHTML)
      .addTo(map);
    });*/

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'long-beach', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'long-beach', (e) => {
    map.getCanvas().style.cursor = '';
  })
  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'land-uses', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'land-uses', (e) => {
    map.getCanvas().style.cursor = '';
  })

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'pov-rate', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'pov-rate', (e) => {
    map.getCanvas().style.cursor = '';
  })
  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'flood-zones', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'flood-zones', (e) => {
    map.getCanvas().style.cursor = '';
  })

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'liquefaction-zone', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'liquefaction-zone', (e) => {
    map.getCanvas().style.cursor = '';
  })

})
