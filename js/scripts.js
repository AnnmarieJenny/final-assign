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
    case 100:
      return {
        color: '#f4f455',
        description: 'Residential',
      };
    case 200:
      return {
        color: '#ea6661',
        description: 'Commercial',
      };
    case 300:
      return {
        color: '#d36ff4',
        description: 'Industrial',
      };
    case 400:
      return {
        color: '#5CA2D1',
        description: 'Institutional',
      };
    case 500:
      return {
        color: '#8ece7c',
        description: 'Park',
      };
    case 600:
      return {
        color: '#dac0e8',
        description: 'Public Right-of-Way',
      };
    case 700:
      return {
        color: '#f79f79',
        description: 'Planned Development',
      };
    case 800:
      return {
        color: '#EE85B5',
        description: 'Specific Plan',
      };
    case 1100:
      return {
        color: '#f7cabf',
        description: 'Mixed Use',
      };
    case 999:
      return {
        color: '#f7f7f7',
        description: 'Not Zoned',
      };
  }
};



// a helper function for looking up colors and descriptions for NYC land use codes
var FloodZoneLookup = (code) => {
  switch (code) {
    case 'A':
      return {
        color: '#0c2c84',
        description: '1% Annual Chance of Flooding [Mandatory Flood Insurance Required]',
      };
    case 'AE':
      return {
        color: '#225ea8',
        description: 'Base Flood Plain [Mandatory Flood Insurance Required]',
      };
    case 'AH':
      return {
        color: '#41b6c4',
        description: '1% Annual Chance of Shallow Flooding',
      };
    case 'VE':
      return {
        color: '#1d91c0',
        description: '1% Chance or Greater of Flooding & An Annual Hazard Associated with Wave Storms [Mandatory Flood Insurance Required]',
      };
    case 'X':
      return {
        color: '#95dedb',
        description: 'Moderate Flood Hazard; Area between limits of the 100-year and 500-year floods',
      };
    case 'X 0.2':
      return {
        color: '#c5edeb',
        description: '0.2% Annual Chance of Flooding',
      };
    case '':
      return {
        color: '#ffffcc',
        description: 'Other',
        };
  }
};

//add in map zoom in and zoom out feature
var nav = new mapboxgl.NavigationControl();
  map.addControl(nav, 'top-left');

map.on('load', function(){
    // add source and layer for land use zoning
    // primary layer 1 of 2
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
          'visibility':'visible'
        },
        'paint': {
          'fill-color': {
        type: 'categorical',
        property: 'GENERAL_CL',
        stops: [ // if time permits try to consolidate since both this and the var above use numeric
          [
            100,
            LandUseLookup(100).color,
          ],
          [
            200,
            LandUseLookup(200).color,
          ],
          [
            300,
            LandUseLookup(300).color,
          ],
          [
            400,
            LandUseLookup(400).color,
          ],
          [
            500,
            LandUseLookup(500).color,
          ],
          [
            600,
            LandUseLookup(600).color,
          ],
          [
            700,
            LandUseLookup(700).color,
          ],
          [
            800,
            LandUseLookup(800).color,
          ],
          [
            1100,
            LandUseLookup(1100).color,
          ],
          [
            999,
            LandUseLookup(999).color,
          ],
        ]
      },
      'fill-outline-color': '#ccc', // can make wider, etc.
      'fill-opacity':1
    }
  });
    // add source and layer for poverty rate
    // primary layer (2 of 2)
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
              FloodZoneLookup('A').color,

            ],
            [
              'AE',
              FloodZoneLookup('AE').color,
            ],
            [
              'AH',
              FloodZoneLookup('AH').color,
            ],
            [
              'VE',
              FloodZoneLookup('VE').color,
            ],
            [
              'X',
              FloodZoneLookup('X').color,
            ],
            [
              'X 0.2',
              FloodZoneLookup('X 0.2').color,
            ],
            [
              '',
              FloodZoneLookup('').color,
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
          'visibility':'visible'
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


// show the Popup
var popup = new mapboxgl.Popup({
  closeOnClick: false
})

// Popup for LandUse and PovRate
// create pop up with multiple properties listed below
map.on('click', function (e) {

// check each layer's visibility
var visibleLayers = [];

  if (map.getLayoutProperty('land-uses', 'visibility') == 'visible') {
      visibleLayers.push('land-uses')
  }
  if (map.getLayoutProperty('pov-rate', 'visibility') == 'visible') {
      visibleLayers.push('pov-rate')
  }
  if (map.getLayoutProperty('flood-zones', 'visibility') == 'visible') {
      visibleLayers.push('flood-zones')
  }
  // visibleLayers --> ['land-use', 'pov-rate', 'flood-zones']

// add var visibleLayers
  var features = map.queryRenderedFeatures(e.point, {
    layers: visibleLayers, // visibleLayers here
  });
console.log(features)

if (features.length > 0) {
  // populate the Popup based on the layer / feature

var clickedFeature = features[0]
var povRate = clickedFeature.properties.ACS_POV2_1

var popContent = [];
  // can set up empty one before
  if(clickedFeature.layer.id === '') {
    var popupContent = `
    ${''}
    `
  }
  // find layer where it comes from
  if(clickedFeature.layer.id === 'land-uses') {
    var popupContent = `
    <b>Land Use: </b>${LandUseLookup(clickedFeature.properties.GENERAL_CL).description}
    `
  }
  if(clickedFeature.layer.id === 'pov-rate') {
    var popupContent = `
    <b>Poverty Rate: </b>${povRate}%
    `
  }
  if(clickedFeature.layer.id === 'flood-zones') {
      var popupContent = `
      <b>Flood Zone Type: </b>${FloodZoneLookup(clickedFeature.properties.ZONE_TYPE).description}
      `
  }
  popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
} else{
  // remove pop up if there are not queryRenderedFeatures
  popup.remove();
}
})

// Popup for LandUse
// create pop up with multiple properties listed below
/*map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['land-uses'],
  });
console.log(features)

if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature

  var clickedFeature = features[0]// problem here? possible there are overlapping features?
  var landuseDescription = LandUseLookup(clickedFeature.properties.GENERAL_CL).description
  var landusePopup = `
      <div>
        <b>Land Use: </b>${landuseDescription}
      </div>
  `
// The code needs to be given indication elsewhere besides the paint area
// of what the case 1 - 10 translate to in terms of GENERAL_CL Land Use codes

  popup.setLngLat(e.lngLat).setHTML(landusePopup).addTo(map);
} else{
  // remove pop up if there are not queryRenderedFeatures
  popup.remove();
}

})
})*/

// Popup for Pov Rate (2016)
// create pop up with multiple properties listed below
/*map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['pov-rate'],
  });
console.log(features)

if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature

  var clickedFeature = features[0]
  var povratePopup = `
      <div>
        <b>Poverty Rate: </b>${clickedFeature.properties.ACS_POV2_1}%
      </div>`
  popup.setLngLat(e.lngLat).setHTML(povratePopup).addTo(map);
    } else{
  // remove pop up if there are not queryRenderedFeatures
  popup.remove();
    }
  })*/

// Popup for Flood Zones
// create pop up with multiple properties listed below
/*map.on('click', function (e) {
  var features = map.queryRenderedFeatures(e.point, {
    layers: ['flood-zones'],
    });
  console.log(features)

  if (features.length > 0) {
  // show the Popup
  // populate the Popup and set its coordinates
  // based on the feature
  var clickedFeature = features[0]
  var floodzoneDescription = FloodZoneLookup(clickedFeature.properties.ZONE_TYPE).description
  var floodzonePopup = `
    <div>
      <b>Flood Zone: </b>${floodzoneDescription}
   </div>`
   popup.setLngLat(e.lngLat).setHTML(floodzonePopup).addTo(map);
      } else{
  // remove pop up if there are not queryRenderedFeatures
    popup.remove();
     }
   })*/

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

  var modal = document.getElementById("myModal");
  // Get about as element  to open the modal
  var btn = document.getElementById("about");
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on about, open the modal
  btn.onclick = function() {
    modal.style.display = "block";
  }

  // When the user clicks on x, close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  //show modal on load
  $( document).ready(function() {
    $('#myModal').show();
    // Handler for .load() called.
  });
})
