/********************* Map Creation *********************/
(() => {
  const width = window.innerWidth / 2,
    height = window.innerHeight - 50;
  let active = d3.select(null);
  let arrondScale = true;

  // Create a path object to manipulate geo data
  // Define projection property
  const projection = d3
    .geoConicConformal() // Lambert-93
    .center([2.454071, 46.279229]) // Center on France
    .scale(Math.max(window.innerHeight, window.innerWidth) * 2.3)
    .translate([width / 2 - 25, height / 2 - 25]);
  const path = d3.geoPath().projection(projection); // Assign projection to path object
  // Create the DIV that will contain our map
  const svg = d3
    .select("#france")
    .append("svg")
    .attr("id", "svg")
    .attr("viewBox", "0 0 " + width + " " + height)
    .attr("preserveAspectRatio", "xMidYMid")
    .attr("class", "Blues");

  // Append the group that will contain our paths
  const deps = svg.append("g");
  let g_accidents, g_arronds;

  /********************* Create deps and handle data *********************/
  Promise.all(promises).then(function (values) {
    const geojson = values[0];
    const csv = values[1];
    const caracts = values[2];
    const arrondissements = values[3];

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
        clicked(e.target, d, id == 75);
      });

    g_arronds = deps.append("g");
    g_arronds
      .attr("id", "arrondissements")
      .selectAll("path")
      .data(arrondissements.features)
      .enter()
      .append("path")
      .attr("id", (d) => "d" + d.properties.c_arinsee)
      .attr("d", path)
      .on("click", (e) => {
        const id = e.target.id.substr(4);
        const d = arrondissements.features.find((f) => f.properties.c_ar == id);
        clicked(e.target, d, true);
      });

    g_accidents = deps.append("g").attr("id", "accidents");

    var quantile = d3
      .scaleQuantile()
      .domain([
        0,
        d3.max(
          csv.filter((d) => !d.NOM_DEPT.includes("Paris ")),
          (e) => parseInt(e.ACCIDENTS) / parseInt(e.POP)
        ),
      ])
      .range(d3.range(9));

    const legend_g = svg.append("g").attr("id", "legend");
    var legend = legend_g.attr("transform", "translate(100, 430)");

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

    setScale(false);

    csv.forEach(function (e, i) {
      d3.select("#d" + e.CODE_DEPT)
        .attr(
          "class",
          (d) =>
            `${
              e.NOM_DEPT.includes("Paris ") ? "arrondissement" : "departement"
            } q${getColorQuantile(e)}-9`
        )
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.65);
          div
            .html(
              `<b>Département : </b>
              ${e.NOM_DEPT}
              <br>
              <b>Population : </b>
              ${e.POP}
              <br>
              <b>Accidents : </b>
              ${e.ACCIDENTS}
              <br>
              <b>Accidents/100'000 habitants : </b>
              ${Math.round((parseInt(e.ACCIDENTS) / parseInt(e.POP)) * 100000)}
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

    function getColorQuantile(e) {
      return quantile(parseInt(e.ACCIDENTS) / parseInt(e.POP));
    }

    function clicked(target, d, isParis = false) {
      if (active.node()?.id === target?.id) {
        return reset();
      }

      const isArrond = !d.properties.hasOwnProperty("CODE_DEPT");
      if (isParis) {
        setScale(true);
        document.querySelector("#arrondissements").classList.add("selected");
        if (!isArrond) {
          document.body.setAttribute("selected", "overview");
          document.querySelector("#arrondissements").classList.add("overview");
        } else {
          document.body.setAttribute("selected", "arrondissement");
          document.querySelector("#arrondissements").classList.remove("overview");
        }
      } else {
        document.body.setAttribute("selected", "departement");
        setScale(false);
        document.querySelector("#arrondissements").classList.remove("selected");
      }

      deps.selectAll("circle").remove();
      active.classed("selected", false);
      document.body.classList.add("selected");
      active = d3.select(target).classed("selected", true);

      const bounds = path.bounds(d);
      if (isArrond) {
        bounds[0][0] -= 1;
        bounds[0][1] -= 1;
        bounds[1][1] += 1;
        bounds[1][1] += 1;
      }
      let dx = bounds[1][0] - bounds[0][0],
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

      // Update charts
      let code = d.properties.CODE_DEPT || d.properties.c_arinsee,
        name = d.properties.NOM_DEPT || d.properties.l_ar + " - Paris";
      updateDeptChart(code, name);
      updateGraviteChart(code, name);
      if (!isArrond) {
        updateVmaGraviteChart(code, name);
        updateVMAChart(code, name);
      }

      if (!isParis || isArrond) {
        setTimeout(() => {
          loadData(d, scale);
        }, 500);
      }
    }

    /** Reset everything */
    function reset() {
      // Reset charts
      updateDeptChart(null);
      updateGraviteChart(null);
      updateVmaGraviteChart(null);
      updateVMAChart(null);

      setScale(false);
      active.classed("selected", false);
      document.body.classList.remove("selected");
      document.body.removeAttribute("selected");
      document.querySelector("#arrondissements").removeAttribute("class");
      active = d3.select(null);

      deps.selectAll("circle").remove();

      deps
        .transition()
        .duration(750)
        .style("stroke-width", "1.5px")
        .attr("transform", "");
    }

    function loadData(dept, scale) {
      const isDept = dept.properties.hasOwnProperty("CODE_DEPT");
      const code = isDept
        ? !dept.properties.CODE_DEPT.match(/[A-Z]/gi)
          ? parseInt(dept.properties.CODE_DEPT)
          : dept.properties.CODE_DEPT
        : dept.properties.c_arinsee;

      let accidents = caracts.filter((c) => (isDept ? c.dep == code : c.com == code));

      g_accidents
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

    function setScale(isArrond) {
      if (arrondScale == isArrond) return;
      else arrondScale = isArrond;

      const coeff = isArrond ? 27000 : 20000;

      var legendScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(csv, (e) =>
            Math.round((parseInt(e.ACCIDENTS) / parseInt(e.POP)) * coeff)
          ),
        ])
        .range([0, 9 * 20]);

      legend_g
        .attr("transform", "translate(50, 430)")
        .call(d3.axisLeft(legendScale).ticks(6));
    }
  });
})();
