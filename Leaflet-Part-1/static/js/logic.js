var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create a function to determine the marker color based on the depth of the earthquake
function getMarkerColor(depth) {
  if (depth > 90) {
    return "#FF0000";
  } else if (depth > 70) {
    return "#FF6600";
  } else if (depth > 50) {
    return "#FFCC00";
  } else if (depth > 30) {
    return "#CCFF00";
  } else if (depth > 10) {
    return "#66FF00";
  } else {
    return "#00FF00";
  }
}

// Create a function to determine the marker size based on the magnitude of the earthquake
function getMarkerSize(magnitude) {
  return magnitude * 5;
}

// Use D3 to retrieve the earthquake data
d3.json(earthquakeURL, function(data) {
  // Create a Leaflet map centered on the United States
  var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });

  // Create a tile layer to add to the map
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Map data © <a href='https://openstreetmap.org'>OpenStreetMap</a> contributors"
  }).addTo(map);

  // Loop through the earthquake data and create a marker for each earthquake
  for (var i = 0; i < data.features.length; i++) {
    var earthquake = data.features[i];
    var latitude = earthquake.geometry.coordinates[1];
    var longitude = earthquake.geometry.coordinates[0];
    var magnitude = earthquake.properties.mag;
    var depth = earthquake.geometry.coordinates[2];

    // Create a circle marker for the earthquake
    var marker = L.circleMarker([latitude, longitude], {
      fillOpacity: 0.75,
      color: "black",
      weight: 0.5,
      fillColor: getMarkerColor(depth),
      radius: getMarkerSize(magnitude)
    }).addTo(map);

    // Add a popup with additional information about the earthquake
    marker.bindPopup("<h3>" + earthquake.properties.place + "</h3><hr><p>" + new Date(earthquake.properties.time) + "</p><p>Magnitude: " + magnitude + "</p><p>Depth: " + depth + " km</p>");
  }

  // Create a legend to provide context for the map data
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var depths = [-10, 10, 30, 50, 70, 90];
    var colors = ["#00FF00", "#66FF00", "#CCFF00", "#FFCC00", "#FF6600", "#FF0000"];

    for (var i = 0; i < depths.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + " km<br>" : "+ km");
    }

    return div;
  };
  legend.addTo(map);
});
  
