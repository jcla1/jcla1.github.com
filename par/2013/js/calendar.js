var width = 860,
    height = 130,
    cellSize = 15;

var day = function(d) { return (d.getDay() + 6) % 7; },
    week = d3.time.format("%W"),
    monthDay = d3.time.format("%d"),
    month = d3.time.format("%b"),
    format = d3.time.format("%Y/%m/%d");

var color = d3.scale.quantile()
    .range(d3.range(8).map(function(d) { return "q" + d + "-11"; }));

var svg = d3.select("#netusage").selectAll("svg")
    .data(d3.range(2013, 2014))
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(40, 15)");

svg.selectAll("text.day")
    .data(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])
  .enter().append("text")
    .style("display", function(d, i) {
      return i % 2 === 0 ? "none": undefined
    })
    .attr("text-anchor", "middle")
    .attr("class", "wday")
    .attr("dx", -10)
    .attr("dy", function(d, i) {
      return i * cellSize + 10;
    })
    .text(function(t) {
      return t[0]
    });

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return week(d) * cellSize; })
    .attr("y", function(d) { return day(d) * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll("text.month")
    .data(rect.filter(function(d){ return monthDay((format.parse(d))) == 1})[0])
  .enter().append("text")
    .attr("class", "month")
    .attr("text-anchor", "middle")
    .attr("x", function(d) {
      return +d3.select(d).attr("x") + cellSize + 10;
    })
    .attr("y", -5)
    .text(function(d) { return month(format.parse(d3.select(d).data()[0])); });



d3.csv("data/net_usage_daily.csv", function(error, csv) {
  var dateFormat = d3.format("02d");

  var data = d3.nest()
    .key(function(d) {
      var d = new Date(parseInt(d.date)*1000);
      return format(d);
    })
    .rollup(function(d) { return (parseFloat(d[0].mib)); })
    .map(csv);

  color.domain(d3.extent(csv, function(d) { var a = parseFloat(d.mib); return 0.0001*a*a; }));

  rect.filter(function(d) { return d in data; })
      .attr("class", function(d) { return "day " + color(data[d]); })
    .select("title")
      .text(function(d) { return d + " " + data[d] + "MiB" });
});