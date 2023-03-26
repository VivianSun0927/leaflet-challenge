// Define the queryURL for earthquakes in the past week
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Perform a GET request to the query URL
d3.json(queryURL).then(function(data){
    // Route data.features object to the createFeatures function.
    createFeatures(data.features);
  });
    

function createFeatures(earthquakeData, platesData){

    // Give each feature a popup describing the place and time of the earthquakes
    function onEachFeature(feature, layer){
        layer.bindPopup(`<h3>Where: ${feature.properties.place}</h3><hr><p>Time: ${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Number of "Felt" Reports: ${feature.properties.felt}`);
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    function createCircleMarker(feature, latlng){
       let options = {
        radius:feature.properties.mag*5,
        fillColor: chooseColor(feature.properties.mag),
        color: chooseColor(feature.properties.mag),
        weight: 1,
        opacity: 0.8,
        fillOpacity: 0.35
       } 
       return L.circleMarker(latlng,options);
    }
    // Create a variable for earthquakes to house latlng, each feature for popup, and cicrle radius/color/weight/opacity
    let earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: createCircleMarker
    });

    // Append earthquakes layer to the createMap function
    createMap(earthquakes);
}

// Create a function to determine the marker color based on the depth of the earthquake
function chooseColor(mag){
    switch(true){
        case(1.0 <= mag && mag <= 2.5):
            return "#0071BC"; // Strong blue
        case (2.5 <= mag && mag <=4.0):
            return "#35BC00";
        case (4.0 <= mag && mag <=5.5):
            return "#BCBC00";
        case (5.5 <= mag && mag <= 8.0):
            return "#BC3500";
        case (8.0 <= mag && mag <=20.0):
            return "#BC0000";
        default:
            return "#E2FFAE";
    }
}

// Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    // Define each magnitude scale to label and color the legend
    // Push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // Add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };


// Create map
function createMap(earthquakes) {
   // Define the streetstylemap tile layer
  let streetstylemap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors",
    maxZoom: 20
});

  // Define the graymap tile layer
  let topomap = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: "Map data &copy; <a href=\"https://www.opentopomap.org/\">OpenTopoMap</a> contributors",
    maxZoom: 20
});

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Street Map": streetstylemap,
    "Topography": topomap
  };

  // Create overlay object to contain our overlays
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [streetstylemap, earthquakes]
  });
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}

  
