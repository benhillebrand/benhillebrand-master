var keyArray = ["POP00_SQMI","POP10_SQMI","AVE_FAM_SZ","MED_AGE","AGE_5_17","AGE_18_21","AGE_22_29","AGE_30_39","AGE_40_49"]; //array of property keys
var expressed = keyArray[0]; //initial attribute

//begin script when window loads
window.onload = initialize();
//the first function called once the html is loaded
function initialize(){
setMap();
};
//set choropleth map parameters
function setMap(){
//draw basemap
var map = new L.map('map').setView([42, -93], 7)
.addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide");
d3.json("data/iowa_counties.json", function(error, collection) {
if (error) throw error;
});
}
var transform = d3.geo.transform({point: projectPoint}),
path = d3.geo.path().projection(transform);
var recolorMap = colorScale(jsonData.features);
var counties = g.selectAll("path")
.data(jsonData.features)
.enter().append("path");
map.on("viewreset", reset);
reset();
// Reposition the SVG to cover the features.
function reset() {
var bounds = path.bounds(jsonData),
topLeft = bounds[0],
bottomRight = bounds[1];
svg.attr("width", bottomRight[0] - topLeft[0])
.attr("height", bottomRight[1] - topLeft[1])
.style("left", topLeft[0] + "px")
.style("top", topLeft[1] + "px");
g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
counties.attr("d", path);
}
// Use Leaflet to implement a D3 geometric transformation.
function projectPoint(x, y) {
var point = map.latLngToLayerPoint(new L.LatLng(y, x));
this.stream.point(point.x, point.y);
}







//create quantile classes with color scale
var color = d3.scale.quantile() //designate quantile scale generator
.range([
"#D4B9DA",
"#C994C7",
"#DF65B0",
"#DD1C77",
"#980043"
]);
//build array of all currently expressed values for input domain
var domainArray = [];
for (var a=0; a<features.length; a++){
domainArray.push(Number(features[a].properties[expressed]));
}
//pass array of expressed values as domain
color.domain(domainArray);
return color; //return the color scale generator
};
function choropleth(d, recolorMap){
//get data value
var value = d.properties[expressed];
//if value exists, assign it a color; otherwise assign gray
if (value) {
return recolorMap(value); //recolorMap holds the colorScale generator
} else {
return "#ccc";
};
};
