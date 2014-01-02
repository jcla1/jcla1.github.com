d3.csv("data/tab_distr.csv", function(err, raw) {
  var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = 360 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;

  var values = raw.reduce(function(a, b) {
    return a.concat(d3.range(b.count).map(function() {
        return b.n;
    }))
  }, []);

  var data = d3.layout.histogram()
    .bins(raw.length)
    (values);

  var x = d3.scale.linear()
    .domain([0, raw.length-1])
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(4)
    .orient("bottom");

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return d.y; })])
    .range([height, 0]);

  var svg = d3.select("#tab_distr").append("svg")
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