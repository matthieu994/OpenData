/********************* Map Creation *********************/
(() => {
  const width = window.innerWidth,
    height = window.innerHeight;
  let active = d3.select(null);

  // Create a path object to manipulate geo data
  // Define projection property
  const projection = d3
    .geoConicConformal() // Lambert-93
    .center([2.454071, 46.279229]) // Center on France
    .scale(4000)
    .translate([width / 2, height / 2]);
  const path = d3.geoPath().projection(projection); // Assign projection to path object
  // Create the DIV that will contain our map
  const svg = d3
    .select("#france")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMinYMid")
    .attr("class", "Blues");

  // Append the group that will contain our paths
  const deps = svg.append("g");

  /********************* Create deps and handle data *********************/
  Promise.all(promises).then(function (values) {
    const geojson = values[0];
    const csv = values[1];
    const caracts = values[2];

    deps
      .selectAll("path")
      .data(geojson.features)
      .enter()
      .append("path")
      .attr("id", (d) => "d" + d.properties.CODE_DEPT)
      .attr("d", path)
      .on("click", (e) => {
        const id = e.target.id.substr(1);
        const d = geojson.features.find((f) => f.properties.CODE_DEPT == id);
        clicked(e.target, d);
      });

    var quantile = d3
      .scaleQuantile()
      .domain([0, d3.max(csv, (e) => +e.POP)])
      .range(d3.range(9));

    var legend = svg
      .append("g")
      .attr("transform", "translate(100, 430)")
      .attr("id", "legend");

    legend
      .selectAll(".colorbar")
      .data(d3.range(9))
      .enter()
      .append("svg:rect")
      .attr("y", (d) => d * 20 + "px")
      .attr("height", "20px")
      .attr("width", "20px")
      .attr("x", "0px")
      .attr("class", (d) => "q" + d + "-9");

    var legendScale = d3
      .scaleLinear()
      .domain([0, d3.max(csv, (e) => +e.POP)])
      .range([0, 9 * 20]);

    svg
      .append("g")
      .attr("transform", "translate(95, 430)")
      .call(d3.axisLeft(legendScale).ticks(7));

    csv.forEach(function (e, i) {
      d3.select("#d" + e.CODE_DEPT)
        .attr("class", (d) => "departement q" + quantile(+e.POP) + "-9")
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.65);
          div
            .html(
              `<b>Région : </b> ${e.NOM_REGION}<br>
              <b>Département : </b>
              ${e.NOM_DEPT}
              <br>
              <b>Population : </b>
              ${e.POP}
              <br>`
            )
            .style("left", d.pageX + 30 + "px")
            .style("top", d.pageY - 30 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(200).style("opacity", 0);
          div.html("").style("left", "-500px").style("top", "-500px");
        });
    });

    // Refresh colors on combo selection
    d3.select("select").on("change", function () {
      d3.selectAll("svg").attr("class", this.value);
    });
    // Append a DIV for the tooltip
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    function clicked(target, d) {
      if (active.node() === target) return reset();
      deps.selectAll("circle").remove();
      active.classed("selected", false);
      document.body.classList.add("selected");
      active = d3.select(target).classed("selected", true);

      var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = 0.7 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

      deps
        .transition()
        .duration(750)
        .style("stroke-width", 1.5 / scale + "px")
        .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

      loadData(d, scale);
    }

    function reset() {
      active.classed("selected", false);
      document.body.classList.remove("selected");
      active = d3.select(null);

      deps.selectAll("circle").remove();

      deps
        .transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
    }

    function loadData(dept, scale) {
      let accidents = caracts.filter(
        (c) => c.dep.padStart(2, "0") == dept.properties.CODE_DEPT
      );

      deps
        .selectAll("circle")
        .data(accidents)
        .enter()
        .append("circle")
        .attr("r", 5 / scale)
        .attr("transform", function (d) {
          return "translate(" + projection([d.long, d.lat]) + ")";
        });

      const domain = [0, d3.max(accidents, (e) => +e.lum)];
      var quantile = d3.scaleQuantile().domain(domain).range(d3.range(5));

      // var legend = svg
      //   .append("g")
      //   .attr("transform", "translate(100, 430)")
      //   .attr("id", "legend");

      // legend
      //   .selectAll(".colorbar")
      //   .data(d3.range(5))
      //   .enter()
      //   .append("svg:rect")
      //   .attr("y", (d) => d * 20 + "px")
      //   .attr("height", "20px")
      //   .attr("width", "20px")
      //   .attr("x", "0px")
      //   .attr("class", (d) => "a" + d + "-9");

      // var legendScale = d3
      //   .scaleLinear()
      //   .domain(domain)
      //   .range([0, 5 * 20]);

      // svg
      //   .append("g")
      //   .attr("transform", "translate(95, 430)")
      //   .call(d3.axisRight(legendScale).ticks(5));

      document.querySelectorAll("circle").forEach((el) => {
        el.classList.add("a" + (quantile(el.__data__.lum) - 1) + "-5");
      });

      setCircleOpacity();
    }
  });
})();
