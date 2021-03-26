mapboxgl.accessToken = 'pk.eyJ1IjoiYW5ubWFyaWVqZW5ueSIsImEiOiJja2w4NGUycWMydHVnMnBwbGtwYTd2bDdsIn0.nw5eYr-3jZj6cS7lDUIFMg';

var map = new mapboxgl.Map({
    container: 'map-container',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-118.119180, 33.797752],
    zoom: 10.8
});

// a helper function for looking up colors and descriptions for land use codes
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



// a helper function for looking up colors and descriptions for flood zone types
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

//add in nav control feature to zoom in and zoom out of map
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');

map.on('load', function() {
    // add source for land uses
    map.addSource('land-uses', {
        type: 'geojson',
        data: 'data/land-uses.geojson'
    });
    // add source for land uses
    // primary layer 1 of 2
    map.addLayer({
        'id': 'land-uses',
        'type': 'fill',
        'source': 'land-uses',
        'layout': {
            'visibility': 'visible' //select/show this layer as default on map
        },
        'paint': {
            'fill-color': {
                type: 'categorical',
                property: 'GENERAL_CL',
                stops: [ // use land use codes (100,200, etc.) to call corresponding colors using the LandUseLookup function
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
            'fill-outline-color': '#ccc',
            'fill-opacity': 1
        }
    });
    // add source for poverty rate
    map.addSource('pov-rate', {
        type: 'geojson',
        data: 'data/pov.geojson'
    });
    // add layer for poverty rate
    // primary layer (2 of 2)
    map.addLayer({
        'id': 'pov-rate',
        'type': 'fill',
        'source': 'pov-rate',
        'layout': {
            'visibility': 'none' //hide this layer as default on map
        },
        'paint': {
            'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'ACS_POV2_1'], //color code based on pov rate % thresholds
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
            'fill-outline-color': '#cccccc',
        }
    })
    // add source for flood zones
    map.addSource('flood-zones', {
        type: 'geojson',
        data: 'data/floods.geojson'
    });
    // add layer for flood zones
    // supplemental layer (1 of 2)
    map.addLayer({
        'id': 'flood-zones',
        'type': 'fill',
        'source': 'flood-zones',
        'layout': {
            'visibility': 'none' // hide layer as default on map
        },
        'paint': {
            'fill-color': {
                type: 'categorical',
                property: 'ZONE_TYPE',
                stops: [ // use flood zone codes (A, AE, etc.) to call corresponding colors using the FloodZoneLookup function
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
            'fill-outline-color': '#ccc',
            'fill-opacity': 0.7
        }
    });
    // add source for liquefaction zones
    map.addSource('liquefaction-zone', {
        type: 'geojson',
        data: 'data/liquefaction.geojson'
    });
    // add layer for liquefaction zones
    // supplemental layer (2 of 2)
    map.addLayer({
        'id': 'liquefaction-zone',
        'type': 'fill',
        'source': 'liquefaction-zone',
        'layout': {
            'visibility': 'visible'// show layer as default on map
        },
        'paint': {
            'fill-outline-color': '#ccc',
            'fill-color': 'lightgreen',
            'fill-opacity': 0.5
        }
    });

    // enable toggling by linking visibility to checkbox status (i.e. checked or unchecked)
    $('.layer-toggle').change(function() {
        const layerId = $(this).attr('id')
        if ($(this).is(':checked')) {
            map.setLayoutProperty(layerId, 'visibility', 'visible');
        } else {
            map.setLayoutProperty(layerId, 'visibility', 'none');
        }
    });

    // create popup
    var popup = new mapboxgl.Popup({
        closeOnClick: false
    })

    // call popup on click for visible layers only
    map.on('click', function(e) {
        // check each layer's visibility
        // visibleLayers --> ['land-use', 'pov-rate', 'flood-zones']
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

        // call features for visibleLayers
        var features = map.queryRenderedFeatures(e.point, {
            layers: visibleLayers,
        });

        if (features.length > 0) {

            // set up variables to call by layer based on visibility (as coded above)
            var clickedFeature = features[0] // for all existing features
            var povRate = clickedFeature.properties.ACS_POV2_1 // for poverty rate
            // note: land use and flood zones will use their respective lookup functions, already created above

            var popContent = [];
            // set up an empty popup for debugging purposes
            if (clickedFeature.layer.id === '') {
                var popupContent = `
                                    ${''}
                                    `
            }
            // show description in popup for landuse layer
            if (clickedFeature.layer.id === 'land-uses') {
                var popupContent = `
                    <b>Land Use: </b>${LandUseLookup(clickedFeature.properties.GENERAL_CL).description}
                    `
            }
            // show rate in popup for poverty rate layer
            if (clickedFeature.layer.id === 'pov-rate') {
                var popupContent = `
                    <b>Poverty Rate: </b>${povRate}%
                    `
            }
            // show description in popup for flood zones layer
            if (clickedFeature.layer.id === 'flood-zones') {
                var popupContent = `
                    <b>Flood Zone Type: </b>${FloodZoneLookup(clickedFeature.properties.ZONE_TYPE).description}
                    `
            }
            popup.setLngLat(e.lngLat).setHTML(popupContent).addTo(map);
        } else {
            // remove pop up if there are not queryRenderedFeatures
            popup.remove();
        }
    })

    // turn pointer on when it hovers over geos/landuse layer
    map.on('mouseenter', 'land-uses', (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })
    // turn pointer off when it hovers away from geos/landuse layer
    map.on('mouseleave', 'land-uses', (e) => {
        map.getCanvas().style.cursor = '';
    })

    // turn pointer on when it hovers over geos/poverty rate layer
    map.on('mouseenter', 'pov-rate', (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })
    // turn pointer off when it hovers away from geos/poverty rate layer
    map.on('mouseleave', 'pov-rate', (e) => {
        map.getCanvas().style.cursor = '';
    })

    // turn pointer on when it hovers over geos/flood zones layer
    map.on('mouseenter', 'flood-zones', (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })
    // turn pointer off when it hovers away from geos/flood zones layer
    map.on('mouseleave', 'flood-zones', (e) => {
        map.getCanvas().style.cursor = '';
    })

    // turn pointer on when it hovers over geos/liquefaction layer
    map.on('mouseenter', 'liquefaction-zone', (e) => {
        map.getCanvas().style.cursor = 'pointer';
    })
    // turn pointer off when it hovers away from geos/liquefaction layer
    map.on('mouseleave', 'liquefaction-zone', (e) => {
        map.getCanvas().style.cursor = '';
    })

    // create js var for modal as coded in html
    // code for modal adapted from https://github.com/aren-kab/nyc-colleges-universities
    var modal = document.getElementById("myModal");
    // get About (in navbar) as element to open the modal
    var btn = document.getElementById("about");
    // get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // when the user clicks on About, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // when the user clicks on 'x', close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // when the user clicks outside of the modal, close the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // side navbar dropdowns
    // loop through all dropdown buttons to toggle between hiding and showing its dropdown content
    // code and descrip for dropdowns was adapted from https://www.w3schools.com/howto/howto_js_dropdown_sidenav.asp
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;

    for (i = 0; i < dropdown.length; i++) {
        dropdown[i].addEventListener("click", function() {
            this.classList.toggle("active");
            var dropdownContent = this.nextElementSibling;
            if (dropdownContent.style.display === "block") {
                dropdownContent.style.display = "none";
            } else {
                dropdownContent.style.display = "block";
            }
        });
    }

    //show modal on load
    $(document).ready(function() {
        $('#myModal').show();
    });
})
