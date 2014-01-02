d3.csv("data/stats.csv", function(err, data) {
  var cards = d3.select("#cards")
      .selectAll("li").data(data)
    .enter().append("li");

  cards.append("h2")
    .html(function(d) { return d.title; });

  cards.append("div")
    .attr('class', "value")
    .html(function(d) { return d.value; });

  cards.append("div")
    .attr('class', "subtext")
    .html(function(d) { return d.subtext; });

  cards.each(function(d) {
    if (!Number(d.special)) return;
    this.style.boxShadow = "0 0 12px " + (d.color ? d.color : "rgba(255, 215, 0, 0.8)");
  });

});