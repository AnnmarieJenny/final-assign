mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ubWFyaWVqZW5ueSIsImEiOiJja2w4NGUycWMydHVnMnBwbGtwYTd2bDdsIn0.nw5eYr-3jZj6cS7lDUIFMg';

var map = new mapboxgl.Map ({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-118.182114,33.777613],
    zoom: 10.5
});

//add in map zoom in and zoom out feature
//var nav = new mapboxgl.NavigationControl();
//map.addControl(nav, 'top-left');

map.on('load', function(){
    // add source and layer for long beach outline
    // primary layer (1 of 3)
    map.addSource('long-beach', {
        type: 'geojson',
        data: 'data/long-beach.geojson'
    });
    map.addLayer({
        'id': 'long-beach-fill',
        'type': 'fill',
        'source': 'long-beach',
        'layout': {},
        'paint': {
          'fill-color': 'yellow',
          'fill-opacity': 0.5
        }
    });
    // add source and layer for land use zoning
    // primary layer 2 of 3
    map.addSource('zoning', {
        type: 'geojson',
        data: 'data/zoning.geojson'
    });
    map.addLayer({
        'id': 'zoning-fill',
        'type': 'fill',
        'source': 'zoning',
        'layout': {},
        'paint': {
          'fill-color': 'pink',
          'fill-opacity': 0.5
        }
    });
    // add source and layer for poverty rate
    // primary layer (3 of 3)
    map.addSource('pov-rate', {
        type: 'geojson',
        data: 'data/pov-rate.geojson'
    });
    map.addLayer({
        'id': 'pov-rate-fill',
        'type': 'fill',
        'source': 'pov-rate',
        'layout': {},
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
        'id': 'flood-zones-fill',
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
    map.addSource('eq-impact', {
        type: 'geojson',
        data: 'data/eq-impact.geojson'
    });
    map.addLayer({
        'id': 'eq-impact-fill',
        'type': 'fill',
        'source': 'eq-impact',
        'layout': {},
        'paint': {
          'fill-color': 'lightgreen',
          'fill-opacity': 0.5
        }
    });
  })
