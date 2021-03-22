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
        color: '#5f5f60',
        description: 'Not Zoned',
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
        'layout': {},
        'paint': {
          'fill-color': {
        type: 'categorical',
        property: 'GENERAL_CL',
        stops: [
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
      'fill-outline-color': '#ccc',
      'fill-opacity':0.7
    }
  });
    // add source and layer for poverty rate
    // primary layer (3 of 3)
    map.addSource('pov-rate', {
        type: 'geojson',
        data: 'data/pov-rate.geojson'
    });
    map.addLayer({
        'id': 'pov-rate',
        'type': 'fill',
        'source': 'pov-rate',
        'layout': {
          'visibility':'none'
        },
        'paint': {
          'fill-color': 'white',
          'fill-opacity': 0.5
        }
    });
    // add source and layer for flood zones
    // supplemental layer (1 of 2)
    map.addSource('flood-zones', {
        type: 'geojson',
        data: 'data/flood-zones.geojson'
    });
    map.addLayer({
        'id': 'flood-zones',
        'type': 'fill',
        'source': 'flood-zones',
        'layout': {},
        'paint': {
          'fill-color': 'lightblue',
          'fill-opacity': 0.5
        }
    });
    // add source and layer for liquefaction zones (caused by EQs)
    // supplemental layer (2 of 2)
    map.addSource('liquefaction-zone', {
        type: 'geojson',
        data: 'data/eq-impact.geojson'
    });
    map.addLayer({
        'id': 'liquefaction-zone',
        'type': 'fill',
        'source': 'liquefaction-zone',
        'layout': {
          'visibility':'none'
        },
        'paint': {
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

/* play around with legend after figuring out how to toggle
  // add in ranges and colors
  var layers = ['0-10', '10-20', '20-50', '50-100', '100-200', '200-500', '500-1000', '1000+'];
  var colors = ['#FFEDA0', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#800026'];
  // add in a legend
  for (i = 0; i < layers.length; i++) {
    var layers = layers[i];
    var color = colors[i];
    var item = document.createElement('div');
    var key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    var value = document.createElement('span');
    value.innerHTML = layer;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
  }*/

/*
  //enumerate ids of the layers
  var toggleableLayerIds = [
    'Long Beach City', 'Land Uses', 'Poverty Rate (2016)', 'Flood Zones', 'Liquefaction Zone'];

  // set up the corresponding toggle button for each layer
  for (var i = 0; i < toggleableLayerIds.length; i++) {
  var id = toggleableLayerIds[i];

  var link = document.createElement('a');
    link.href = '#';
    link.className = 'active';
    link.textContent = id;

  link.onclick = function (e) {
  var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

  var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    // toggle layer visibility by changing the layout object's visibility property
    if (visibility === 'visible') {
        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
        this.className = '';
    }
    else {
        this.className = 'active';
        map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
    };

  var layers = document.getElementById('menu');
  layers.appendChild(link);
}

  // create pop up with multiple properties listed below
  map.on('click', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
      layers: ['Long Beach City', 'Land Uses', 'Poverty Rate (2016)', 'Flood Zones', 'Liquefaction Zone']
    });
    // use function (VacantLots) from above to create a var that pulls from that data
    var myHTML = `
        <div><b>Name: </b>${features[0].properties.Name}</div>
        `
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(myHTML)
      .addTo(map);
    });*/

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'Long Beach City', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'Long Beach City', (e) => {
    map.getCanvas().style.cursor = '';
  })
  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'Land Uses', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'Land Uses', (e) => {
    map.getCanvas().style.cursor = '';
  })

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'Poverty Rate (2016)', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'Poverty Rate (2016)', (e) => {
    map.getCanvas().style.cursor = '';
  })
  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'Flood Zones', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'Flood Zones', (e) => {
    map.getCanvas().style.cursor = '';
  })

  // turn pointer on when it hovers over geos/vacant lots
  map.on('mouseenter', 'Liquefaction Zone', (e) => {
    map.getCanvas().style.cursor = 'pointer';
      })
  // turn pointer off when it hovers away from geos/vacant lots
  map.on('mouseleave', 'Liquefaction Zone', (e) => {
    map.getCanvas().style.cursor = '';
  })

})
