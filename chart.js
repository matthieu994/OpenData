let hours_chart;
const distrib_hours = [
  1132, 897, 845, 617, 654, 950, 1303, 2576, 3485, 3045, 2698, 2860, 3062, 2945, 3193,
  3462, 4221, 5089, 4843, 3676, 2609, 1891, 1470, 1317,
];

function overviewChart() {
  const data = {
    labels: new Array(24)
      .fill(0)
      .map((_, index) => `${String(index).padStart(2, "0")}:00`),
    datasets: [
      {
        label: `Accidents en 1 heure`,
        data: distrib_hours,
        borderColor: "#3b4e6a",
        fill: false,
        stepped: false,
      },
    ],
  };

  var ctx = document.getElementById("distrib_hours").getContext("2d");
  hours_chart = new Chart(ctx, {
    type: "line",
    data,
    options: {
      responsive: true,
      interaction: {
        intersect: false,
        axis: "x",
      },
      plugins: {
        title: {
          display: true,
          text: "Nombre d'accidents en fonction de l'heure en FRANCE",
        },
      },
    },
  });
}

function updateDeptChart(dept, dept_name) {
  if (dept === null) {
    hours_chart.data.datasets[0].data = distrib_hours;
    hours_chart.options.plugins.title.text =
      "Nombre d'accidents en fonction de l'heure en FRANCE";
  } else {
    hours_chart.data.datasets[0].data = distrib_hours_depts[`${dept}`];
    hours_chart.options.plugins.title.text =
      "Nombre d'accidents en fonction de l'heure en " + dept_name;
  }
  hours_chart.update();
}

overviewChart();
