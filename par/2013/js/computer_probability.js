d3.csv("data/computer_probability.csv", function(err, data) {
  var BASE_TICKS = [0, 7200, 14400, 21600, 28800, 36000, 43200, 50400, 57600, 64800, 72000, 79200, 86400];

  var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = 750 - margin.left - margin.right,
    height = 170 - margin.top - margin.bottom;

  var formatTime = formatTime = d3.time.format("%H:%M"),
    formatHours = function(d) { return formatTime(new Date(d*1000 - (new Date(0)).getHours() * 3600000)) };

  var x = d3.scale.linear()
    .domain([0, 86400])
    .range([0, width]);

  var xAxis = d3.svg.axis()
    .scale(x)
    //.ticks(12)
    .tickValues(BASE_TICKS)
    .orient("bottom")
    .tickFormat(formatHours);

  var y = d3.scale.linear()
    .domain([0, d3.max(data, function(d) { return parseInt(d.occ); })])
    .range([height, 0]);

  var svg = d3.select("#computer_probability").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // var bar = svg.selectAll(".bar")
  //   .data(data)
  // .enter().append("g")
  //   .attr("class", "bar")
  //   .attr("transform", function(d) { return "translate(" + x(parseInt(d.timestart)) + "," + y(parseInt(d.occ)) + ")"; });

  // bar.append("rect")
  //   .attr("x", 0)
  //   .attr("width", 1)
  //   .attr("height", function(d) { return height - y(parseInt(d.occ)); });

  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(parseInt(d.timestart)); })
    .y(function(d) { return y(parseInt(d.occ)); });

  var area = d3.svg.area()
    .interpolate("basis")
    .y0(height)
    .x(function(d) { return x(parseInt(d.timestart)); })
    .y1(function(d) { return y(parseInt(d.occ)); });

  svg.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);


  // this rect is so the group expands to its full size,
  // so the mousemove event will fire
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "transparent")

  function show_ruler(svg, xAxis) {
    svg.selectAll(".ruler").style("display", "inherit");
  }

  function hide_ruler(svg, xAxis) {
    svg.selectAll(".ruler").style("display", "none");
    xAxis.tickValues(BASE_TICKS);
    svg.selectAll(".x.axis").call(xAxis)
  }

  svg.append("line")
    .attr({
      "class": "ruler",
      "y1": -20,
      "y2": 110
    });

  svg.on("mouseenter", function() { show_ruler(svg, xAxis); });
  svg.on("mouseleave", function() { hide_ruler(svg, xAxis); });
  svg.on("mousemove", function() {
      svg.selectAll(".ruler").attr({
        "x1": d3.mouse(this)[0]-1,
        "x2": d3.mouse(this)[0]-1
      });

      xAxis.tickValues([~~x.invert(d3.mouse(this)[0])]);
      svg.selectAll(".x.axis").call(xAxis)
  })

});