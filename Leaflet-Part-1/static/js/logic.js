// Overlay group
var earthquakeLayer = new L.layerGroup();


var overlays = {
    Earthquakes: earthquakeLayer
}

// Adding the tile layers
var geoLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href=https://www.openstreetmap.org/copyright>OpenStreetMap</a> contributors'
})


// base layers
var baseLayers = {
    Geo: geoLayer
} 

// Creating the map object
var myMap = L.map("map", {
    center: [37.6000, -95.6650],
    zoom: 3.5, 
    // Display on load
    layers: [geoLayer]
});

// Layer control
L.control.layers(baseLayers,overlays, {
    collapsed: false
  }).addTo(myMap);

// Getting the colors for the circles and legend based on depth
function mapColor(depth) {
    return depth >= 90 ? "#FF0D0D" :
        depth < 90 && depth >= 70 ? "#FF4E11" :
        depth < 70 && depth >= 50 ? "#FF8E15" :
        depth < 50 && depth >= 30 ? "#FFB92E" :
        depth < 30 && depth >= 10 ? "#ACB334" :
                                    "#69B34C";
}

// Drawing the circles
function drawCircle(point, latlng) {
    let mag = point.properties.mag;
    let depth = point.geometry.coordinates[2];
    return L.circle(latlng, {
            fillOpacity: 0.5,
            color: mapColor(depth),
            fillColor: mapColor(depth),
            // The size of the circle is based on magnitude of the earthquake
            radius: mag * 20000
    })
}

// Displaying info when the feature is clicked
function bindPopUp(feature, layer) {
    layer.bindPopup(`Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`);
}

// The link to get the Earthquak GeoJSON data
var url = " https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting the GeoJSON data
d3.json(url).then((data) => {
    var features = data.features;

    // Creating a GeoJSON layer with the retrieved data
    L.geoJSON(features, {
        pointToLayer: drawCircle,
        onEachFeature: bindPopUp
    }).addTo(earthquakeLayer);

    // Setting up the legend


    let legend = L.control({position: 'bottomright'});

    legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'info legend');
        grades = [-10, 10, 30, 50, 70, 90];

        // Looping through our intervals and generating a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + mapColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

legend.addTo(myMap)
})


  