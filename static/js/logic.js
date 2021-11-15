
var map = L.map("map", {
    center: [45, -100],
    zoom: 4
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  }).addTo(map);



// BASE URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// READ JASON DATA FROM URL
d3.json(url).then(function(data) {

    // FUNCTION TO SET COLOR RANGE | VALUES DERIVED FROM PANDAS QUANTILES (SEE JUPYTER NOTEBOOK)
    function getColor(d) {
        return d > 87.00 ? '#004B23' :
               d > 31.75 ? '#006400' :
               d > 10.00 ? '#007200' :
               d > 5.92  ? '#38B000' :
               d > 2.12  ? '#70E000' :
               d > 0     ? '#9EF01A' :
                           '#D1FF46' ;
    };

// ADD CIRCLE MARKERS
L.geoJSON(data, {
    pointToLayer: function(feature, coord) {
        return L.circleMarker(coord,
            {
                radius: feature.properties.mag*2.2,
                fillOpacity: 0.65,
                fillColor: getColor(feature.geometry.coordinates[2]),
                stroke:true,
                color: "white",
                weight: .5
            });
    },
    onEachFeature (feature, layer) {
        layer.bindPopup(`<h3>LOCATION: ${feature.properties.place}</h3><hr><h4>MAGNITUDE: ${feature.properties.mag}</h4><hr><a href="${feature.properties.url}">READ MORE</a>`);
    }
}).addTo(map);

// ADD LEGEND
var legend = L.control({ position: "topright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    // LEGEND INFO
    var content = "<h1>Earthquakes</h1><p class='legend'>This map was created using a USGS dataset of every recorded earthquake in the last 30 days.</p><hr>" +
    "<span class='dot' style='background-color:#004B23;'></span><div class='legendColor'>Deeper</div><br>" +
    "<span class='dot' style='background-color:#9EF01A;'></span><div class='legendColor'>Shallower</div><hr>" +
    "<span class='dot-lg'></span><div class='legendColor'>&#8593; Magnitude</div><br>" +
    "<span class='dot-sm'></span><div class='legendColor'>&#8595; Magnitude</div><br>";

    div.innerHTML = content;
    return div;
  };

  legend.addTo(map);


});

  
