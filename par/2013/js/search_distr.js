d3.csv("data/search_distr.csv", function(err, raw) {
  var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = 360 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;

  var formatTime = formatTime = d3.time.format("%H:%M"),
    formatHours = function(d) { return formatTime(new Date(d*1000 - (new Date(0)).getHours() * 3600000)) };

  var values = raw.map(function(a) {
    return parseInt(a.date) % 86400;
  });

  var x = d3.scale.linear()
    .domain([0, 86400])
    .range([0, width]);

  var data = d3.layout.histogram()
    .bins(x.ticks(60))
    (values);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues([0, 21600, 43200, 64800, 86400])
    .orient("bottom")
    .tickFormat(formatHours);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

  var svg = d3.select("#search_distr").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
    .data(data)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
    .attr("x", 0)
    .attr("width", x(data[0].dx) - 1)
    .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

});